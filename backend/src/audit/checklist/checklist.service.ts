import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ChecklistService {
  constructor(private readonly prisma: PrismaClient) {}

  async getCategories() {
    return this.prisma.auditCategory.findMany({
      include: {
        checklists: {
          orderBy: { sort_order: 'asc' },
        },
      },
      orderBy: { sort_order: 'asc' },
    });
  }

  // Accepts the entire nested tree and synchronizes the database
  async syncStructure(categories: any[]) {
    // We will do this in a transaction to ensure data integrity
    return this.prisma.$transaction(async (tx) => {
      // 1. Get all existing categories and points to determine what to delete
      const existingCategories = await tx.auditCategory.findMany({
        include: { checklists: true }
      });

      const incomingCategoryIds = categories.filter(c => c.id).map(c => c.id);
      
      // Delete categories that are no longer in the incoming payload
      for (const ec of existingCategories) {
        if (!incomingCategoryIds.includes(ec.id)) {
          await tx.auditCategory.delete({ where: { id: ec.id } });
        }
      }

      // 2. Upsert categories and their points
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        
        let savedCategory;
        if (cat.id && cat.id > 0) {
          // Update existing
          savedCategory = await tx.auditCategory.update({
            where: { id: cat.id },
            data: { name: cat.name, sort_order: i }
          });
        } else {
          // Create new
          savedCategory = await tx.auditCategory.create({
            data: { name: cat.name, sort_order: i }
          });
        }

        // Process points for this category
        if (cat.checklists && Array.isArray(cat.checklists)) {
          const incomingPointIds = cat.checklists.filter((p: any) => p.id).map((p: any) => p.id);
          
          // Delete points that are no longer in this category
          const existingPoints = await tx.auditChecklistPoint.findMany({ where: { category_id: savedCategory.id } });
          for (const ep of existingPoints) {
            if (!incomingPointIds.includes(ep.id)) {
              await tx.auditChecklistPoint.delete({ where: { id: ep.id } });
            }
          }

          // Upsert points
          for (let j = 0; j < cat.checklists.length; j++) {
            const point = cat.checklists[j];
            if (point.id && point.id > 0) {
              await tx.auditChecklistPoint.update({
                where: { id: point.id },
                data: { question: point.question, sort_order: j, category_id: savedCategory.id }
              });
            } else {
              await tx.auditChecklistPoint.create({
                data: { question: point.question, sort_order: j, category_id: savedCategory.id }
              });
            }
          }
        }
      }
      
      return this.getCategories();
    });
  }
}
