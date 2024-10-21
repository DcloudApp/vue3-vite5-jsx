<script lang='jsx'>
import logo from '@/assets/logo.svg'

export default defineComponent({
  setup() {
    const isDark = useDark()
    const toggleDark = useToggle(isDark)
    return () => (

      <>
        <div>
          <header className="w-full flex flex-col items-center justify-center">
            <img
              alt="Vue logo"
              className="mt-10"
              src={logo}
              width="125"
              height="125"
            />
            <div className="py-10">
              <nav>
                <RouterLink to="/">Home </RouterLink>
                <RouterLink to="/About"> About</RouterLink>
              </nav>
            </div>
          </header>
          <button
            className="m-auto my-10 w-fit flex btn"
            onClick={() => {
              toggleDark()
            }}
          >
            <span className="i-icon-mic"></span>
          </button>
          <HelloWorld />
          <RouterView />
        </div>
      </>
    )
  },
})
</script>
