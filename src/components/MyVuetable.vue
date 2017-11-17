<template>
  <div class="ui container">
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfoTop"></vuetable-pagination-info>
      <vuetable-pagination ref="paginationTop" @vuetable-pagination:change-page="onChangePage"></vuetable-pagination>
    </div>
    <vuetable ref="vuetable" :sort-order="sortOrder" api-url="https://vuetable.ratiw.net/api/users" :fields="fields" pagination-path="" :muti-sort="true" multi-sort-key="ctrl" @vuetable:pagination-data="onPaginationData"></vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
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
  import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo'
  import Vue from 'vue'
  import CustomActions from './CustomActions'
  
  Vue.component('custom-actions', CustomActions)
  
  export default {
    components: {
      Vuetable,
      VuetablePagination,
      VuetablePaginationInfo
    },
    data() {
      return {
        sortOrder: [{
          field: 'email',
          sortField: 'email',
          direction: 'asc'
        }],
        css: {
          ascendingIcon: 'glyphicon glyphicon-chevron-up',
          descendingIcon: 'glyphicon glyphicon-chevron-down'
        },
        fields: [{
            name: 'name',
            sortField: 'name'
          },
          {
            name: 'email',
            sortField: 'email'
          },
          {
            name: 'age',
            sortField: 'birthdate', // <----
            dataClass: 'center aligned'
          },
          {
            name: "birthdate",
            titleClass: "center aligned",
            dataClass: "center aligned",
            callback: "formatDate|DD-MM-YYYY"
          },
          {
            name: "nickname",
            callback: "allcap"
          },
          {
            name: "gender",
            titleClass: "center aligned",
            dataClass: "center aligned",
            callback: "genderLabel"
          },
          {
            name: "salary",
            titleClass: "center aligned",
            dataClass: "right aligned",
            callback: "formatNumber"
          },
          //.. https://github.com/ratiw/vuetable-2-tutorial/wiki/lesson-11#__componentname
          {
            name: '__component:custom-actions', // <----
            title: 'Actions',
            titleClass: 'center aligned',
            dataClass: 'center aligned'
          }
        ]
      };
    },
    methods: {
      allcap(value) {
        return value.toUpperCase();
      },
      genderLabel(value) {
        return value === "M" ?
          '<span class="ui teal label"><i class="large man icon"></i>Male</span>' :
          '<span class="ui pink label"><i class="large woman icon"></i>Female</span>';
      },
      formatNumber(value) {
        return accounting.formatNumber(value, 2);
      },
      formatDate(value, fmt = "D MMM YYYY") {
        return value == null ? "" : moment(value, "YYYY-MM-DD").format(fmt);
      },
      onPaginationData(paginationData) {
        this.$refs.paginationTop.setPaginationData(paginationData) // <----
        this.$refs.paginationInfoTop.setPaginationData(paginationData) // <----
  
        this.$refs.pagination.setPaginationData(paginationData)
        this.$refs.paginationInfo.setPaginationData(paginationData)
      },
      onChangePage(page) {
        this.$refs.vuetable.changePage(page)
      }
    }
  };
</script>