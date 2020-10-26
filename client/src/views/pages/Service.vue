<template>
  <div>
    <!-- <page-title-bar></page-title-bar> -->
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <app-card :heading="$t('message.service_title')" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
          <div class="pa-3">
            <v-btn raised color="primary" @click.stop="openadd">Add</v-btn>
          </div>
          <v-data-table v-bind:headers="headers" :items="this.getServices">
            <template slot="items" slot-scope="props">
              <td>{{ props.index + 1 + pagenum * pagesize }}</td>
              <td>{{ props.item.service_name }}</td>
              <td>{{ props.item.service_desc }}</td>
              <td>
                <v-btn flat icon small @click.stop="openedit(props.item)">
                  <v-icon class="font-md">ti-pencil</v-icon>
                </v-btn>
                <v-btn flat icon small @click.stop="deletedata(props.item)">
                  <v-icon class="font-md">ti-trash</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </app-card>
      </v-layout>

      <v-dialog v-model="diag_flag" max-width="700">
        <v-card>
          <v-card-title class="headline ml-2">{{diag_title}}</v-card-title>
          <v-card-title class="headline ml-2 mr-2">

            <v-flex xs12 sm12>
              <v-text-field name="service_name" label="Service Name" v-model="item.service_name" :error-messages="this.getServiceError.service_name"></v-text-field>
            </v-flex>

            <v-flex xs12 sm12>
              <v-text-field name="service_desc" label="Service Description" v-model="item.service_desc" :error-messages="this.getServiceError.service_desc"></v-text-field>
            </v-flex>
          </v-card-title>

          <v-card-actions>

            <v-spacer></v-spacer>
            <v-btn color="success" flat="flat" @click.native="saveData">Save</v-btn>
            <v-btn color="error" flat="flat" @click.native="resetData">Reset</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="isDelete" max-width="500">
          <v-card>
              <v-card-title class="headline ml-2">Are you sure?</v-card-title>

              <v-card-actions>

                  <v-spacer></v-spacer>
                  <v-btn color="success" flat="flat" @click.native="deleteYes">Yes</v-btn>
                  <v-btn color="error" flat="flat" @click.native="deleteNo">No</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loader: true,
      headers: [
        {
          text: "No",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "Service Name", value: "service_name" },
        { text: "Description", value: "service_desc" },
        { text: "Action", value: "action" }
      ],
      items: [],
      item: {},

      diag_flag: false,
      diag_title: "",
      diag_type: 0, // 0: add, 1: update
      pagenum: 0,
      pagesize: 20,
      isDelete: false,
      delItem: {}
    };
  },
  mounted() {
    this.getTableData();
    this.loader = false;
    this.resetData();
  },
  methods: {
    getTableData() {
      let data = {
        pagenum: this.pagenum,
        pagesize: this.pagesize
      };
      this.$store.dispatch("getServiceList", data);
    },
    openadd() {
      this.$store.dispatch("resetServiceErrors", {});
      this.diag_title = "Add service";
      this.diag_type = 0;
      this.diag_flag = true;
      this.resetData();
    },
    openedit(item) {
      this.$store.dispatch("resetServiceErrors", {});
      this.diag_title = "Edit service";
      this.diag_type = 1;
      this.diag_flag = true;
      this.item = {
        service_id: item.service_id,
        service_name: item.service_name,
        service_desc: item.service_desc
      };
    },
    saveData() {
      var data = {
        service_id: this.item.service_id,
        service_name: this.item.service_name,
        service_desc: this.item.service_desc,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      };
      if (this.diag_type == 0) {
        this.$store.dispatch("addService", data);
      } else {
        this.$store.dispatch("updateService", data);
      }
    },
    resetData() {
      this.item = {
        cust_fn: "",
        cust_ln: "",
        email: "",
        phone: "",
        address_1: "",
        address_2: "",
        city: "",
        zip_code: "",
        state: ""
      };
    },
    deleteYes() {
      this.isDelete = false;
      let data = {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        service_id: this.delItem.service_id
      };
      this.$store.dispatch("deleteService", data);
    },
    deleteNo() {
      this.isDelete = false;
    },
    deletedata(item) {
      this.isDelete = true;
      this.delItem = item;
    }
  },
  computed: {
    ...mapGetters(["getServices", "getServiceError", "getServiceCreatedFlag"])
  },
  watch: {
    getServiceCreatedFlag: function(newValue) {
      if (newValue) {
        this.diag_flag = false;
      }
    }
  }
};
</script>
