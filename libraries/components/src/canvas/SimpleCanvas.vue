<template>
  <div class="relative h-screen w-screen overflow-hidden">
    <div class="absolute top-4 left-4 z-10">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        @click="centerCanvas"
      >
        Center Canvas
      </button>
      <label class="ml-4">
        <input
          type="checkbox"
          v-model="gridEnabled"
        />
        Show Grid
      </label>
      <label class="ml-4">
        Grid Mode:
        <select
          v-model="gridMode"
          class="ml-2 border rounded px-2"
        >
          <option
            v-for="(mode, index) in gridModes"
            :key="index"
            :value="index"
          >
            {{ mode.label }}
          </option>
        </select>
      </label>
    </div>

    <v-stage
      ref="stageRef"
      :config="stageConfig"
      @dblclick="handleDblClick"
      @dragover.prevent="handleDragOver"
      @drop="handleDrop"
      @wheel="handleWheel"
      @dragmove="updateGridPoints"
    >
      <v-layer ref="layerRef">
        <v-circle
          v-if="gridEnabled"
          v-for="point in gridPoints"
          :key="point.id"
          :config="point"
        />
        <v-text
          v-for="(text, idx) in texts"
          :key="text.id"
          :config="text"
          :stroke="selectedTextId === text.id ? 'blue' : 'transparent'"
          :strokeWidth="selectedTextId === text.id ? 2 : 0"
          @click="selectText(text)"
          @dragstart="handleDragStart"
          @dragend="handleDragEnd"
        />
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup lang="ts">
  import Konva from "konva";
  import { getCurrentInstance, onMounted, reactive, ref, watch } from "vue";
  import VueKonva from "vue-konva";

  // TODO: try out https://konvajs.org/docs/sandbox/Web_Worker.html#sidebar

  // workaround: Register VueKonva globally
  const instance = getCurrentInstance();
  const appContext = instance?.appContext;
  appContext?.app.use(VueKonva);

  const stageRef = ref(null);
  const layerRef = ref<Konva.Layer | null>(null);

  const stageConfig: Konva.StageConfig = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true
  });

  const gridEnabled = ref(true);
  const gridMode = ref(2); // Default grid mode
  const gridModes = [
    { size: 10, label: "Very Small" },
    { size: 20, label: "Small" },
    { size: 50, label: "Medium" },
    { size: 100, label: "Large" },
    { size: 200, label: "Very Large" }
  ];

  const selectedTextId = ref<string | null>(null);
  const texts = reactive<Konva.TextConfig[]>([]);
  const gridPoints = ref<Konva.CircleConfig[]>([]);

  const updateGridPoints = () => {
    if (!gridEnabled.value) {
      gridPoints.value = [];
      return;
    }

    const size = gridModes[gridMode.value].size;
    const points: Konva.CircleConfig[] = [];
    const stage = stageRef.value?.getStage?.();
    if (!stage) return;

    const viewport = {
      x: -stage.x() / stage.scaleX(),
      y: -stage.y() / stage.scaleY(),
      width: window.innerWidth / stage.scaleX(),
      height: window.innerHeight / stage.scaleY()
    };

    const offset = size * 2;
    const startX = Math.floor((viewport.x - offset) / size) * size;
    const startY = Math.floor((viewport.y - offset) / size) * size;
    const endX = Math.ceil((viewport.x + viewport.width + offset) / size) * size;
    const endY = Math.ceil((viewport.y + viewport.height + offset) / size) * size;

    for (let x = startX; x <= endX; x += size) {
      for (let y = startY; y <= endY; y += size) {
        points.push({
          id: `grid-point-${x}-${y}`,
          x,
          y,
          radius: 2,
          fill: "#aaa"
        });
      }
    }

    gridPoints.value = points;
  };

  watch([stageRef, gridMode, gridEnabled], () => {
    updateGridPoints();
  });

  onMounted(() => {
    const stage = stageRef.value?.getStage?.();
    if (!stage) return;

    stage.on("dragmove", updateGridPoints);
    stage.on("scale", updateGridPoints);
    updateGridPoints();
  });

  const minZoom = 0.5;
  const maxZoom = 2;
  const handleWheel = (konvaEvent: Konva.KonvaEventObject<WheelEvent>) => {
    const event = konvaEvent.evt;
    event.preventDefault();
    const stage = konvaEvent.target as Konva.Stage;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scaleBy = 1.05;
    const newScale = event.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    if (newScale < minZoom || newScale > maxZoom) return;

    stage.scale({ x: newScale, y: newScale });
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale
    };

    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    });
    stage.batchDraw();
    updateGridPoints();
  };

  const centerCanvas = () => {
    const stage = stageRef.value?.getStage?.();
    if (!stage) return;
    stage.position({ x: 0, y: 0 });
    stage.scale({ x: 1, y: 1 });
    updateGridPoints();
  };

  const activeInput = ref<HTMLTextAreaElement | null>(null);

  const startWriting = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.value?.getStage?.();
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scale = stage.scaleX();
    const adjustedX = (pointer.x - stage.x()) / scale;
    const adjustedY = (pointer.y - stage.y()) / scale;

    const size = gridModes[gridMode.value].size;
    const snappedX = gridEnabled.value ? Math.round(adjustedX / size) * size : adjustedX;
    const snappedY = gridEnabled.value ? Math.round(adjustedY / size) * size : adjustedY;

    const input = document.createElement("textarea");
    input.style.position = "absolute";
    input.style.left = `${snappedX * scale + stage.x()}px`;
    input.style.top = `${snappedY * scale + stage.y()}px`;
    input.style.width = `${150 * scale}px`;
    input.style.height = `${30 * scale}px`;
    input.style.fontSize = `${16 * scale}px`;
    input.style.padding = "4px";
    input.style.border = "1px solid #ccc";
    input.style.background = "#fff";
    input.style.resize = "none";
    input.style.lineHeight = "1.5";
    input.style.zIndex = "10";
    document.body.appendChild(input);
    input.focus();
    activeInput.value = input;

    const removeInput = () => {
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };

    const removeInputText = () => {
      activeInput.value = null;
      removeInput();
    };

    const addInput = () => {
      texts.push({
        id: `text-${texts.length}`,
        x: snappedX,
        y: snappedY,
        text: input.value,
        fontSize: 16,
        draggable: true
      });
      removeInputText();
    };

    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        addInput();
      }
    });

    document.addEventListener(
      "mousedown",
      (e) => {
        if (!input.contains(e.target as Node)) {
          removeInput(); //TODO: should probably add the text, just remove the input field
        }
      },
      { once: true }
    );
  };

  const handleDblClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (activeInput.value) return;
    startWriting(event);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    const stage = stageRef.value?.getStage?.();
    if (!stage) return;
    const position = stage.getPointerPosition();
    if (!position || !event.dataTransfer) return;

    const text = event.dataTransfer.getData("text/plain");
    if (!text) return;

    texts.push({
      id: `text-${texts.length}`,
      x: position.x,
      y: position.y,
      text,
      fontSize: 16,
      draggable: true
    });
  };

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.target.moveToTop();
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!gridEnabled.value) return;
    const size = gridModes[gridMode.value].size;
    const node = e.target;
    const newX = Math.round(node.x() / size) * size;
    const newY = Math.round(node.y() / size) * size;
    node.position({ x: newX, y: newY });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const size = gridModes[gridMode.value].size;
      if (event.shiftKey) {
        texts.forEach((text) => {
          text.x = text.x - size; //TODO: only move selected text
        });
      } else {
        texts.forEach((text) => {
          text.x = text.x + size;
        });
      }
    }
  };

  const selectText = (text: Konva.TextConfig) => {
    selectedTextId.value = text.id;
  };

  window.addEventListener("keydown", handleKeyDown);

  window.addEventListener("resize", () => {
    stageConfig.width = window.innerWidth;
    stageConfig.height = window.innerHeight;
  });
</script>
