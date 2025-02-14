<i18n lang="json5">
  {
    en: {
      hello: "hello world!",
      test:'test',
    },
    zh: {
      hello: "我的世界！",
      test:'测试',
    }
  }
</i18n>

<script lang='jsx'>
import { useI18n } from 'vue-i18n'

export default defineComponent({
  props: {},
  emits: [],
  setup() {
    const { t } = useI18n()
    return () => (
      <>
        <div>
          <div className="c h-full w-full flex flex-col items-center justify-center">
            {t('test')}
            <div>
              {t('hello')}
            </div>
          </div>
        </div>
      </>
    )
  },
})
</script>

<style scoped>
.c {
  color: red;
}
</style>
