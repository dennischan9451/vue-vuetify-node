import Full from 'Container/Full'

// Extensions components
const Customer = () => import('Views/pages/Customer');
const Store = () => import('Views/pages/Store');
const Service = () => import('Views/pages/Service');
const Staff = () => import('Views/pages/Staff');
const Repair = () => import('Views/pages/Repair');
const Employee = () => import('Views/pages/Employee');
const Status = () => import('Views/pages/Status');

export default {
   path: '/',
   component: Full,
   redirect: '/ftu/customer',
   children: [
      {
         path: '/ftu/customer',
         component: Customer,
         meta: {
            title: 'message.customer',
            requiresAuth: true,
         }
      },
      {
         path: '/ftu/store',
         component: Store,
         meta: {
            title: 'message.store',
            requiresAuth: true,
         }
      },
      {
         path: '/ftu/service',
         component: Service,
         meta: {
            title: 'message.service',
            requiresAuth: true,
         }
      },
      {
         path: '/ftu/staff',
         component: Staff,
         meta: {
            title: 'message.staff',
            requiresAuth: true,
         }
      },
      {
         path: '/ftu/repair',
         component: Repair,
         meta: {
            title: 'message.repair',
            requiresAuth: true,
         }
      },
      {
         path: '/ftu/employee',
         component: Employee,
         meta: {
            title: 'message.employee',
            requiresAuth: true,
         }
      },
      {
         path: '/ftu/status',
         component: Status,
         meta: {
            title: 'message.status',
            requiresAuth: true,
         }
      },
   ]
}
