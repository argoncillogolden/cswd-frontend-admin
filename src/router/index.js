import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/NotFound.vue';
import LoginPage from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import AllBenefeciaries from '@/views/AllBenefeciaries.vue';
import HandOvers from '@/views/HandOvers.vue';
import HandOverEvent from '@/views/HandOverEvent.vue';
import NewBenefeciary from '@/views/NewBenefeciary.vue';
import NewHandOverSchedule from '@/views/NewHandOverSchedule.vue';
import Help from '@/views/Help.vue';
import About from '@/views/About.vue';
import Settings from '@/views/Settings.vue';
import Reference from '@/views/Reference.vue';
import { useAuthStore } from '@/stores/auth';

const routes = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    { path: '/', name: 'LoginPage', component: LoginPage, meta: { requiresAuth: false } },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/all-benefeciaries', name: 'AllBenefeciaries', component: AllBenefeciaries, meta: { requiresAuth: true } },
    { path: '/hand-overs', name: 'HandOvers', component: HandOvers, meta: { requiresAuth: true } },
    { path: '/hand-over-event/:handOverId', name: 'HandOverEvent', component: HandOverEvent, props: true, meta: { requiresAuth: true } },
    { path: '/new-benefeciary', name: 'NewBenefeciary', component: NewBenefeciary, meta: { requiresAuth: true } },
    { path: '/new-hand-over-schedule', name: 'NewHandOverSchedule', component: NewHandOverSchedule, meta: { requiresAuth: true } },
    { path: '/help', name: 'Help', component: Help, meta: { requiresAuth: true } },
    { path: '/about', name: 'About', component: About, meta: { requiresAuth: true } },
    { path: '/settings', name: 'Settings', component: Settings, meta: { requiresAuth: true } },
    { path: '/reference/:reference', name: 'Reference', component: Reference },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore();
    authStore.checkAuth();
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/';
    }
    
    if (to.path === '/' && authStore.isAuthenticated) {
        return '/dashboard';
    }
});

export default router;
