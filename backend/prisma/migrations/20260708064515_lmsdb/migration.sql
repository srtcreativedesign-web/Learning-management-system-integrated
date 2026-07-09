-- CreateTable
CREATE TABLE "users_shadow" (
    "id" TEXT NOT NULL,
    "hris_user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_shadow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "divisions_shadow" (
    "id" TEXT NOT NULL,
    "hris_division_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "divisions_shadow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_materials" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content_url" TEXT,
    "min_read_time" INTEGER,

    CONSTRAINT "course_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_course_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "employee_course_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_quiz_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "is_passed" BOOLEAN NOT NULL,

    CONSTRAINT "employee_quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "audit_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_checklists" (
    "id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,

    CONSTRAINT "audit_checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_inspections" (
    "id" TEXT NOT NULL,
    "auditor_id" TEXT NOT NULL,
    "division_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "audit_inspections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_findings" (
    "id" TEXT NOT NULL,
    "inspection_id" TEXT NOT NULL,
    "checklist_id" TEXT NOT NULL,
    "notes" TEXT,
    "photo_path" TEXT,
    "is_compliant" BOOLEAN NOT NULL,
    "sync_status" TEXT NOT NULL DEFAULT 'pending',
    "last_modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_findings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_shadow_hris_user_id_key" ON "users_shadow"("hris_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_shadow_email_key" ON "users_shadow"("email");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_shadow_hris_division_id_key" ON "divisions_shadow"("hris_division_id");

-- AddForeignKey
ALTER TABLE "course_materials" ADD CONSTRAINT "course_materials_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_course_progress" ADD CONSTRAINT "employee_course_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_shadow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_course_progress" ADD CONSTRAINT "employee_course_progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_quiz_attempts" ADD CONSTRAINT "employee_quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_shadow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_checklists" ADD CONSTRAINT "audit_checklists_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "audit_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_inspections" ADD CONSTRAINT "audit_inspections_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "divisions_shadow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_findings" ADD CONSTRAINT "audit_findings_inspection_id_fkey" FOREIGN KEY ("inspection_id") REFERENCES "audit_inspections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_findings" ADD CONSTRAINT "audit_findings_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "audit_checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
