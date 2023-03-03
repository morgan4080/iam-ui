import { computed } from "vue";
import { useStore } from "vuex";
export const mapState = () => {
  const store: any = useStore();
  return Object.fromEntries(
    Object.keys(store.state).map(key => [key, computed(() => store.state[key])])
  );
};
export const mapGetters = () => {
  const store: any = useStore();
  return Object.fromEntries(
    Object.keys(store.getters).map(getter => [
      getter,
      computed(() => store.getters[getter]),
    ])
  );
};
export const mapMutations = () => {
  const store: any = useStore();
  return Object.fromEntries(
    Object.keys(store._mutations).map(mutation => [
      mutation,
      (value: any) => store.commit(mutation, value),
    ])
  );
};
export const mapActions = () => {
  const store: any = useStore();
  return Object.fromEntries(
    Object.keys(store._actions).map(action => [
      action,
      (value: any) => store.dispatch(action, value),
    ])
  );
};
//nothing
