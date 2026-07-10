import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/quiz-builder',
      name: 'quiz-builder',
      component: () => import('../views/QuizBuilderView.vue'),
    },
    {
      path: '/outlets',
      name: 'outlets',
      component: () => import('../views/audit/OutletManagement.vue'),
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('../views/EmployeeManagement.vue'),
    },
    {
      path: '/checklist-builder',
      name: 'checklist-builder',
      component: () => import('../views/audit/ChecklistBuilder.vue'),
    },
    {
      path: '/analytics/training/in-class',
      name: 'analytics-training-in-class',
      component: () => import('../views/analytics/TrainingAnalytics.vue'),
    },
    {
      path: '/analytics/training/on-site',
      name: 'analytics-training-on-site',
      component: () => import('../views/analytics/TrainingAnalytics.vue'),
    },
    {
      path: '/analytics/training/online',
      name: 'analytics-training-online',
      component: () => import('../views/analytics/TrainingAnalytics.vue'),
    },
    {
      path: '/analytics/audit',
      name: 'analytics-audit',
      component: () => import('../views/analytics/AuditAnalytics.vue'),
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue'),
    },
    {
      path: '/library/course/:id',
      name: 'library-detail',
      component: () => import('../views/LibraryDetailView.vue'),
    },
    {
      path: '/library/generate-quiz',
      name: 'library-generate-quiz',
      component: () => import('../views/LibraryQuizGenerate.vue'),
    },
  ],
})

export default router
