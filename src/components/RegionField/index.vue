<template>
  <view class="uni-form-item uni-column">
    <uni-forms-item
      :name="props.item.id"
      :rules="[
        {
          required: props.item.required,
          errorMessage: `${props.item.label}不能为空`,
        },
      ]"
    >
      <template #label>
        <custom-label :item="props.item"></custom-label>
      </template>
      <tui-bottom-popup
        :zIndex="1002"
        :maskZIndex="1001"
        :show="model.popupShow"
        @close="popup"
      >
        <tui-cascade-selection
          request
          height="400px"
          :itemList="model.dataTree"
          :receiveData="model.receiveData"
          @complete="complete"
          @change="onchange"
          :reset="props.value.showRegion"
        ></tui-cascade-selection
      ></tui-bottom-popup>
      <view
        :class="['custom-input', props.item.readonly ? 'disable' : '']"
        @click="show"
      >
        {{ props.value.showRegion }}
      </view>
    </uni-forms-item>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import user from "@/api/modules/user";
import tuiCascadeSelection from "@/common/tui-cascade-selection/tui-cascade-selection.vue";
import tuiBottomPopup from "@/common/tui-bottom-popup/tui-bottom-popup.vue";
import { AreaItem } from "@/constants/form";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  value: {
    type: Object,
    required: true,
  },
});

interface ShowValue {
  text: string;
  value: number;
  levelId: number;
}

interface Model {
  dataTree: Array<ShowValue>;
  popupShow: boolean;
  receiveData: Array<ShowValue>;
}

const model: Model = reactive({
  dataTree: [],
  popupShow: false,
  receiveData: [],
});

function show() {
  if (props.item.readonly) {
    return;
  }
  model.popupShow = true;
}

const onchange = e => {
  if (e.levelId == props.item.type) {
    model.receiveData = [];
    model.popupShow = false;
    return;
  }
  user.getAreaData(e.value).then(res => {
    //查找当前层级要限制的ID
    const filter = res.datas.filter(({ id }) =>
      props.item.limit.flat().includes(id)
    );
    

    if (filter.length) {
      model.receiveData = formatValue(filter);
    } else {
      model.receiveData = formatValue(res.datas);
    }
  });
};

function formatValue(array: Array<AreaItem>): Array<ShowValue> {
  return array.map(({ name, id, levelId }) => ({
    text: name,
    value: id,
    levelId,
  }));
}

// 关闭
const popup = () => {
  model.popupShow = false;
};

const complete = e => {
  props.value.showRegion = e.text;
  props.value[props.item.id] = e.result.map(({ value }) => value);
};

const initAreaData = () => {
  user.getAreaData(0).then(res => {
    //查找当前层级要限制的ID
    const filter = res.datas.filter(({ id }) =>
      props.item.limit.flat().includes(id)
    );
    if (filter.length) {
      model.dataTree = formatValue(filter);
    } else {
      model.dataTree = formatValue(res.datas);
    }
    initDeafault();
  });
};

const initDeafault = () => {
  if (props.item.defaultValue.length) {
    props.value[props.item.id] = props.item.defaultValue;

    const { text: fistName } = model.dataTree.find(
      ({ value }) => value == props.item.defaultValue[0]
    ) || { text: "" };

    user.getAreaData(props.item.defaultValue[0]).then(res => {
      const { name } = res.datas.find(
        ({ id }) => id == props.item.defaultValue[1]
      ) || { name: "" };
      props.value.showRegion = fistName + name;
    });
  }
};

onMounted(() => {
  initAreaData();
});
</script>

<style></style>
