export default defineComponent({
  props: {},
  emits: [],
  setup() {
    return () => (
      <>
        <div>
          <button
            className="m-auto my-10 w-fit flex btn"
          >
            <span className="i-custom-test dark:text-red-400"></span>
          </button>
          <button
            className="m-auto my-10 w-fit flex btn"
          >
            <span className="i-custom-videocam dark:text-red-400"></span>
          </button>
          <button
            className="m-auto my-10 w-fit flex btn"
          >
            <span className="i-custom-user dark:text-red-400"></span>
          </button>
        </div>
      </>
    )
  },
})
