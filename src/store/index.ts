import { createPinia } from 'pinia'
import { createUnistorage } from 'pinia-plugin-unistorage'
const pinia = createPinia()
pinia.use(createUnistorage())
export default pinia
export * from './modules/countStore'
export * from './modules/clientInfo'
export * from './modules/formInfo'
export * from './modules/userInfo'