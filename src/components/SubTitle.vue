<template>
    <v-row 
        no-gutters justify="center" 
        class="text-title | mb-2"
    >
        <v-col class="text-center">
            {{ title }}
        </v-col>
    </v-row>
    <v-row 
        no-gutters justify="center"
        class="text-subtitle | mb-9"
    >
        <v-col class="text-center" v-html="props.desc"></v-col>
    </v-row>
</template>

<script setup>
// ----- 선언부 ----- //
import { onMounted, onUnmounted, ref, computed, watch} from "vue";

const props = defineProps({
    title: String,
    desc: String
});

// ----- 라이프 사이클 ----- //
onMounted(() => {
    
});

onUnmounted(() => {

})

// ----- 함수 정의 ----- //


</script>

<style scoped>
.text-title {
    font-size: 19.5px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: -0.5px;
}

.text-subtitle {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    letter-spacing: -0.4px;
    color: #404040;
}
</style>