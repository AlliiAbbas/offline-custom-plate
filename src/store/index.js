import { createStore } from 'vuex';
import Vehicle from './modules/Vehicle';
import Auth from "@/store/modules/Auth";

export default createStore({
  modules: {
    Vehicle,
    Auth,
  }
}) 