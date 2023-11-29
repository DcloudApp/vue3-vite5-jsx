import { RouterLink, RouterView } from "vue-router";
import { defineComponent } from "vue";
import logo from "@/assets/logo.svg";
export default defineComponent({
  props: {},
  emits: [],
  setup() {
    return () => (
      <>
        <header className="w-full flex flex-col items-center justify-center">
          <img
            alt="Vue logo"
            class="logo"
            src={logo}
            width="125"
            height="125"
          />
          <div className=" py-10">
            <nav>
              <RouterLink to="/">Home </RouterLink>
              <RouterLink to="/about"> About</RouterLink>
            </nav>
          </div>
        </header>
        <button className="btn w-fit h-10 flex m-auto my-10 ">222</button>
        <RouterView />
      </>
    );
  },
});
