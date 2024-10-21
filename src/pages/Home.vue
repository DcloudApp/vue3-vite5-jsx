<script lang='jsx'>
export default defineComponent({
  setup() {
    const { t } = useI18n()
    return () => (
      <>
        <div className="w-full flex items-center justify-center">
          <h1>{t('title')}</h1>
          <div>Home</div>
        </div>
      </>
    )
  },
})
</script>

<route lang="json5">
  {
    path:'/',
    name: 'Home',
    meta: {
      title: 'Home',
      description: 'Home',
    }
  }
</route>
