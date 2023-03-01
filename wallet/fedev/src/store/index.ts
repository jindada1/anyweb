import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import type { App } from "vue";

export interface Config {
    baseRoute?: string;
}

export interface State {
    config: Config
}

const store = createStore<State>({
    state() {
        return {
            config: {},
        };
    },
    mutations: {
        initConfig(state: State, config: Config) {
            state.config = config;
        },
    },
    getters: {
        getConfig: (state) => {
            return state.config;
        }
    }
});

// https://v3.cn.vuejs.org/api/composition-api.html#provide-inject
const key: InjectionKey<Store<State>> = Symbol();

// wrap vuex's useStore
export function useStore() {
    return baseUseStore(key);
}

export function setupStore(app: App<Element>) {
    app.use(store, key);
}

export default store;