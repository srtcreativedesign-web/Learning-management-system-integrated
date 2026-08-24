import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class InHouseService {
  constructor(private readonly prisma: PrismaClient) {}

  // Helper to map score (1-5) to Grade SB, B, C, K
  getGradeFromScore(score: number): 'SB' | 'B' | 'C' | 'K' {
    if (score >= 5) return 'SB';
    if (score >= 4) return 'B';
    if (score >= 3) return 'C';
    return 'K';
  }

  // Helper to calculate summary grade from percentage
  getOverallGrade(percentage: number): 'SB' | 'B' | 'C' | 'K' {
    if (percentage >= 85) return 'SB';
    if (percentage >= 70) return 'B';
    if (percentage >= 55) return 'C';
    return 'K';
  }

  // 1. Get Checklist Structure (with auto-seeding if empty)
  async getCategories() {
    let categories = await this.prisma.inHouseCategory.findMany({
      include: {
        checklists: {
          orderBy: { sort_order: 'asc' },
        },
      },
      orderBy: { sort_order: 'asc' },
    });

    if (categories.length === 0) {
      // Seed default initial categories for in-house training
      const defaultData = [
        {
          name: 'Standar Grooming & Penampilan',
          sort_order: 0,
          points: [
            { question: 'Kerapian seragam, apron, dan nametag sesuai standar', description: 'Seragam bersih, tidak kusut, sepatu tertutup dan bersih' },
            { question: 'Kebersihan personal (rambut, kuku, wewangian)', description: 'Rambut rapi/hairnet terpasang, kuku pendek dan bersih' },
          ]
        },
        {
          name: 'Standar Pelayanan & Hospitality',
          sort_order: 1,
          points: [
            { question: 'Ketepatan greeting & senyum ramah saat menyambut pelanggan', description: 'Memberikan salam dengan kontak mata dan senyum tulus' },
            { question: 'Penguasaan menu rekomendasi dan upselling', description: 'Mampu menjelaskan menu unggulan dan menawarkan add-on dengan baik' },
            { question: 'Kecepatan dan ketepatan transaksi kasir/POS', description: 'Menginput pesanan tanpa kesalahan dan konfirmasi nominal pembayaran' },
          ]
        },
        {
          name: 'Standar Operasional Produk & Resep',
          sort_order: 2,
          points: [
            { question: 'Kepatuhan terhadap resep & takaran baku (gramasi)', description: 'Menggunakan measuring tools dan resep standar tanpa improvisasi' },
            { question: 'Kualitas rasa, suhu penyajian, dan presentasi visual', description: 'Sesuai standar temperatur dan plating/packaging rapi' },
            { question: 'Kecepatan waktu penyajian (Serving Time)', description: 'Waktu proses sesuai standar SOP (misal < 5 menit)' },
          ]
        },
        {
          name: 'Kebersihan & Sanitasi Area Kerja',
          sort_order: 3,
          points: [
            { question: 'Penerapan Clean As You Go di workstation', description: 'Meja kerja, peralatan, dan sink selalu bersih setelah digunakan' },
            { question: 'Penyimpanan bahan baku sesuai metode FIFO & labelling tanggal', description: 'Label expired tercantum jelas dan rotasi bahan tertib' },
          ]
        }
      ];

      for (const cat of defaultData) {
        const createdCat = await this.prisma.inHouseCategory.create({
          data: {
            name: cat.name,
            sort_order: cat.sort_order,
          }
        });

        for (let j = 0; j < cat.points.length; j++) {
          await this.prisma.inHouseChecklistPoint.create({
            data: {
              category_id: createdCat.id,
              question: cat.points[j].question,
              description: cat.points[j].description,
              max_score: 5,
              sort_order: j
            }
          });
        }
      }

      categories = await this.prisma.inHouseCategory.findMany({
        include: {
          checklists: {
            orderBy: { sort_order: 'asc' },
          },
        },
        orderBy: { sort_order: 'asc' },
      });
    }

    return categories;
  }

  // 2. Sync / Save Checklist Structure
  async syncStructure(categories: any[]) {
    return this.prisma.$transaction(async (tx) => {
      const existingCategories = await tx.inHouseCategory.findMany({
        include: { checklists: true },
      });

      const incomingCategoryIds = categories.filter((c) => c.id).map((c) => c.id);

      // Delete categories that were removed
      for (const ec of existingCategories) {
        if (!incomingCategoryIds.includes(ec.id)) {
          await tx.inHouseCategory.delete({ where: { id: ec.id } });
        }
      }

      // Upsert categories & points
      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        let savedCategory;

        if (cat.id && typeof cat.id === 'string' && cat.id.length > 5) {
          savedCategory = await tx.inHouseCategory.update({
            where: { id: cat.id },
            data: { name: cat.name, sort_order: i },
          });
        } else {
          savedCategory = await tx.inHouseCategory.create({
            data: { name: cat.name, sort_order: i },
          });
        }

        if (cat.checklists && Array.isArray(cat.checklists)) {
          const incomingPointIds = cat.checklists.filter((p: any) => p.id).map((p: any) => p.id);
          const existingPoints = await tx.inHouseChecklistPoint.findMany({
            where: { category_id: savedCategory.id },
          });

          for (const ep of existingPoints) {
            if (!incomingPointIds.includes(ep.id)) {
              await tx.inHouseChecklistPoint.delete({ where: { id: ep.id } });
            }
          }

          for (let j = 0; j < cat.checklists.length; j++) {
            const point = cat.checklists[j];
            const maxScore = point.max_score || 5;

            if (point.id && typeof point.id === 'string' && point.id.length > 5) {
              await tx.inHouseChecklistPoint.update({
                where: { id: point.id },
                data: {
                  question: point.question,
                  description: point.description || null,
                  max_score: maxScore,
                  sort_order: j,
                  category_id: savedCategory.id,
                },
              });
            } else {
              await tx.inHouseChecklistPoint.create({
                data: {
                  question: point.question,
                  description: point.description || null,
                  max_score: maxScore,
                  sort_order: j,
                  category_id: savedCategory.id,
                },
              });
            }
          }
        }
      }

      return this.getCategories();
    });
  }

  // 3. List Training Sessions
  async getSessions(filters?: { outletId?: string; status?: string }) {
    const where: any = {};
    if (filters?.outletId) where.outlet_id = filters.outletId;
    if (filters?.status) where.status = filters.status;

    return this.prisma.inHouseSession.findMany({
      where,
      orderBy: { training_date: 'desc' },
      include: {
        assessments: {
          include: {
            checklistPoint: {
              include: { category: true }
            }
          }
        }
      }
    });
  }

  // 4. Get Session By ID
  async getSessionById(id: string) {
    return this.prisma.inHouseSession.findUnique({
      where: { id },
      include: {
        assessments: {
          include: {
            checklistPoint: {
              include: { category: true }
            }
          }
        }
      }
    });
  }

  // 5. Submit / Save Training Evaluation Session with Auto Calculations
  async saveSession(payload: {
    trainer_name?: string;
    outlet_id?: string;
    trainee_name?: string;
    training_date?: string;
    pic_name?: string;
    trainer_signature?: string;
    pic_signature?: string;
    notes?: string;
    assessments: Array<{
      checklist_point_id: string;
      score: number; // 1 - 5
      notes?: string;
    }>;
  }) {
    // 1. Calculate scores
    const pointIds = payload.assessments.map(a => a.checklist_point_id);
    const points = await this.prisma.inHouseChecklistPoint.findMany({
      where: { id: { in: pointIds } }
    });

    const pointMap = new Map(points.map(p => [p.id, p]));

    let totalScore = 0;
    let maxScore = 0;

    const assessmentData = payload.assessments.map(item => {
      const point = pointMap.get(item.checklist_point_id);
      const itemMax = point?.max_score || 5;
      const score = Math.max(1, Math.min(itemMax, item.score || 1));
      const grade = this.getGradeFromScore(score);

      totalScore += score;
      maxScore += itemMax;

      return {
        checklist_point_id: item.checklist_point_id,
        score,
        grade,
        notes: item.notes || null,
      };
    });

    const percentage = maxScore > 0 ? parseFloat(((totalScore / maxScore) * 100).toFixed(1)) : 0;
    const overallGrade = this.getOverallGrade(percentage);
    const isPassed = percentage >= 70; // 70% passing threshold (Grade B/SB)

    const session = await this.prisma.inHouseSession.create({
      data: {
        trainer_name: payload.trainer_name || 'Trainer TnD',
        outlet_id: payload.outlet_id || null,
        trainee_name: payload.trainee_name || 'Tim Staf Outlet',
        training_date: payload.training_date ? new Date(payload.training_date) : new Date(),
        status: 'completed',
        total_score: totalScore,
        max_score: maxScore,
        percentage,
        grade: overallGrade,
        is_passed: isPassed,
        pic_name: payload.pic_name || null,
        trainer_signature: payload.trainer_signature || null,
        pic_signature: payload.pic_signature || null,
        notes: payload.notes || null,
        assessments: {
          create: assessmentData
        }
      },
      include: {
        assessments: {
          include: { checklistPoint: true }
        }
      }
    });

    return session;
  }

  // 6. Delete Session
  async deleteSession(id: string) {
    return this.prisma.inHouseSession.delete({ where: { id } });
  }
}
