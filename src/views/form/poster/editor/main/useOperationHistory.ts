import { useRefHistory } from "@vueuse/core";
import { usePosterStore } from "@/stores/formPoster";
import { storeToRefs } from "pinia";

const posterStore = usePosterStore();

const { posterWidgetList } = storeToRefs(posterStore);

const { history, undo, redo } = useRefHistory(posterWidgetList, {
  deep: true,
  capacity: 15 // limit to 15 history records
});

export default () => {
  return {
    history,
    undo,
    redo
  };
};
