export default defineComponent({
  setup() {
    const { t } = useI18n()
    return () => (
      <>
        <div className="w-full flex items-center justify-center">
          <h1>{t('title')}</h1>
        </div>
      </>
    )
  },
})
