<script lang="tsx">
// @ts-nocheck
import { defineComponent } from 'vue'
import { notifications } from './index'

export default defineComponent({
  name: 'NotificationContainer',
  render() {
    return (
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end sm:items-start"
        style="z-index: 999"
      >
        {notifications.value['top-right'].length > 0 && (
          <div className="absolute right-0 top-0 flex flex-col items-end space-y-2 px-4 py-6 sm:p-6">
            {...notifications.value['top-right']}
          </div>
        )}
        {notifications.value['top-left'].length > 0 && (
          <div className="absolute left-0 top-0 flex flex-col items-start space-y-2 px-4 py-6 sm:p-6">
            {...notifications.value['top-left']}
          </div>
        )}
        {notifications.value['bottom-right'].length > 0 && (
          <div className="absolute bottom-0 right-0 flex flex-col items-end space-y-2 px-4 py-6 sm:p-6">
            {...notifications.value['bottom-right']}
          </div>
        )}
        {notifications.value['bottom-left'].length > 0 && (
          <div className="absolute bottom-0 left-0 flex flex-col items-start space-y-2 px-4 py-6 sm:p-6">
            {...notifications.value['bottom-left']}
          </div>
        )}
      </div>
    )
  },
})
</script>

<style></style>
