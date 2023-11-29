import { defineComponent } from 'vue'

export default defineComponent({
  props: {},
  emits: [],
  setup() {
    return () => (
      <>
        <div className="w-full flex items-center justify-center">
          <h1>This is an home page</h1>
        </div>
      </>
    )
  },
})
