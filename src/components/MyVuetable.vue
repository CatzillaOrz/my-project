<template>
  <div class="ui container">

      <filter-bar></filter-bar>
    <vuetable ref="vuetable"
      :api-url="apiUrl"
      :append-params="appendParams"
      :fields="fields"
      :multi-sort="true"
      :per-page="10"
      :sort-order="sortOrder"
      detail-row-component="detailRowComponent"
      pagination-path=""
    >
      <template slot="actions" slot-scope="props">
          <div class="custom-actions">
            <button class="ui basic button"
              @click="onAction('view-item', props.rowData, props.rowIndex)">
              <i class="zoom icon"></i>
            </button>
            <button class="ui basic button"
              @click="onAction('edit-item', props.rowData, props.rowIndex)">
              <i class="edit icon"></i>
            </button>
            <button class="ui basic button"
              @click="onAction('delete-item', props.rowData, props.rowIndex)">
              <i class="delete icon"></i>
            </button>
          </div>
      </template>
    </vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref = "paginationInfo"></vuetable-pagination-info>
      <vuetable-pagination ref="pagination" @vuetable-pagination:change-page="onChangePage"></vuetable-pagination>
    </div>
  </div>
</template>

<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import accounting from "accounting";
import moment from "moment";
// import VuetablePagination from 'vuetable-2/src/components/VuetablePaginationDropdown'
import VuetablePagination from "vuetable-2/src/components/VuetablePagination";
import VuetablePaginationInfo from "vuetable-2/src/components/VuetablePaginationInfo";
import Vue from "vue";
import CustomActions from "./CustomActions";
import FilterBar from "./FilterBar";
import VueEvents from "vue-events";

Vue.component("custom-actions", CustomActions);
Vue.component("filter-bar", FilterBar);
Vue.use(VueEvents);

export default {
  name: "my-vuetable",
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo
  },
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    sortOrder: {
      type: Array,
      default() {
        return [];
      }
    },
    appendParams: {
      type: Object,
      default() {
        return {};
      }
    },
    detailRowComponent: {
      type: String
    }
  },
  mounted() {
    this.$events.$on("filter-set", eventData => this.onFilterSet(eventData));
    this.$events.$on("filter-reset", e => this.onFilterReset());
  },
  methods: {
    allcap(value) {
      return value.toUpperCase();
    },
    onCellClicked(data, field, event) {
      console.log("cellClicked: ", field.name);
      this.$refs.vuetable.toggleDetailRow(data.id);
    },
    genderLabel(value) {
      return value === "M"
        ? '<span class="ui teal label"><i class="large man icon"></i>Male</span>'
        : '<span class="ui pink label"><i class="large woman icon"></i>Female</span>';
    },
    formatNumber(value) {
      return accounting.formatNumber(value, 2);
    },
    formatDate(value, fmt = "D MMM YYYY") {
      return value == null ? "" : moment(value, "YYYY-MM-DD").format(fmt);
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
      this.$refs.paginationInfo.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    //...https://github.com/ratiw/vuetable-2-tutorial/wiki/lesson-11#__slotname--v120
    onAction(action, data, index) {
      console.log("slot) action: " + action, data.name, index);
    },
    onFilterSet(filterText) {
      this.appendParams.filter = filterText;
      Vue.nextTick(() => this.$refs.vuetable.refresh());
    },
    onFilterReset() {
      delete this.appendParams.filter;
      Vue.nextTick(() => this.$refs.vuetable.refresh());
    }
  }
};
</script>
