import { createSSRApp } from "vue";
import App from "./App.vue";
import pinia from '@/store'
import dayjs from 'dayjs'
import uniBadge from "../node_modules/@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue"
import uniFormsItem from "../node_modules/@dcloudio/uni-ui/lib/uni-forms-item/uni-forms-item.vue";
import uniEasyinput from "../node_modules/@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.vue";
import uniRate from "../node_modules/@dcloudio/uni-ui/lib/uni-rate/uni-rate.vue";
import uniCons from "../node_modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue";
import uniForms from "../node_modules/@dcloudio/uni-ui/lib/uni-forms/uni-forms.vue";
import uniLoadMore from "../node_modules/@dcloudio/uni-ui/lib/uni-load-more/uni-load-more.vue"
import uniTooltip from "../node_modules/@dcloudio/uni-ui/lib/uni-tooltip/uni-tooltip.vue"
import uniRow from "../node_modules/@dcloudio/uni-ui/lib/uni-row/uni-row.vue"
import uniFilePicker from "../node_modules/@dcloudio/uni-ui/lib/uni-file-picker/uni-file-picker.vue";
import customLabel from "@/common/label/index.vue";
import uniDataCheckbox from "../node_modules/@dcloudio/uni-ui/lib/uni-data-checkbox/uni-data-checkbox.vue";
import uniDataSelect from "../node_modules/@dcloudio/uni-ui/lib/uni-data-select/uni-data-select.vue";
import uniSection from "../node_modules/@dcloudio/uni-ui/lib/uni-section/uni-section.vue"
import uniLink from "../node_modules/@dcloudio/uni-ui/lib/uni-link/uni-link.vue"
import uniPopup from "../node_modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue"
import uniTransition from "../node_modules/@dcloudio/uni-ui/lib/uni-transition/uni-transition.vue"
import uniSearchBar from "../node_modules/@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue"
import uniTable from '../node_modules/@dcloudio/uni-ui/lib/uni-table/uni-table.vue'

import '../node_modules/@dcloudio/uni-ui/lib/uni-scss/variables.scss'

dayjs().format()

export function createApp() {

  const app = createSSRApp(App);

  app.component("custom-label", customLabel)
  app.component("uni-badge", uniBadge)
  app.component("uni-forms", uniForms)
  app.component("uni-section", uniSection)
  app.component("uni-forms-item", uniFormsItem)
  app.component("uni-easyinput", uniEasyinput)
  app.component("uni-rate", uniRate)
  app.component("uni-icons", uniCons)
  app.component("uni-file-picker", uniFilePicker)
  app.component("uni-load-more", uniLoadMore)
  app.component("uni-tooltip", uniTooltip)
  app.component("uni-row", uniRow)
  app.component("uni-data-select", uniDataSelect)
  app.component("uni-data-checkbox", uniDataCheckbox)
  app.component("uni-link", uniLink)
  app.component("uni-popup", uniPopup)
  app.component("uni-transition", uniTransition)
  app.component("uni-search", uniSearchBar)
  app.component("uni-table", uniTable)

  app.use(pinia)
  return {
    app,
    pinia
  };
}

/**
 *  "amap": {
                "key": "ebe763d930d7cfa38a604b741f2955de",
                "securityJsCode": "2d27ddc208e0ade8667f35fe90376e46",
                "serviceHost": ""
            }
 */
