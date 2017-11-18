<template>
  <div class="ui container">

      <filter-bar></filter-bar>
    <vuetable ref="vuetable"
      :append-params="moreParams"
      :fields="fields" pagination-path="" :muti-sort="true"
      :sort-order="sortOrder"
      @vuetable:cell-clicked="onCellClicked"
      @vuetable:pagination-data="onPaginationData"
      api-url="https://vuetable.ratiw.net/api/users"
      detail-row-component="my-detail-row"
      multi-sort-key="ctrl"
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
import DetailRow from "./DetailRow";
import FilterBar from "./FilterBar";
import VueEvents from "vue-events";
import FieldDefs from './FieldDefs.js';

Vue.component("custom-actions", CustomActions);
Vue.component("my-detail-row", DetailRow);
Vue.component("filter-bar", FilterBar);
Vue.use(VueEvents);

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo
  },
  data() {
    return {
      sortOrder: [
        {
          field: "email",
          sortField: "email",
          direction: "asc"
        }
      ],
      moreParams: {},
      css: {
        ascendingIcon: "glyphicon glyphicon-chevron-up",
        descendingIcon: "glyphicon glyphicon-chevron-down"
      },
      fields: FieldDefs,
    };
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
      this.moreParams = {
        filter: filterText
      };
      Vue.nextTick(() => this.$refs.vuetable.refresh());
    },
    onFilterReset() {
      this.moreParams = {};
      Vue.nextTick(() => this.$refs.vuetable.refresh());
    }
  }
};
</script>
