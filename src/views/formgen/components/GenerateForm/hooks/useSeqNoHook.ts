import { ref } from "vue";

export function useFormSeqNo() {
  const lastSeqNo = ref<number>(0);

  return {
    lastSeqNo
  };
}
