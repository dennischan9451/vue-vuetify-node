<template>
  <div>
    <!-- <page-title-bar></page-title-bar> -->
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <app-card :heading="$t('message.repair_title')" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
          <div class="pa-3">
            <v-btn raised color="primary" @click.stop="openadd">Add</v-btn>
          </div>
          <v-data-table v-bind:headers="headers" :items="this.getRepairs">
            <template slot="items" slot-scope="props">
              <td>{{ props.index + 1 }}</td>
              <td>{{ props.item.cust_fn + ' ' + props.item.cust_ln }}</td>
              <td>{{ props.item.staff_fn + ' ' + props.item.staff_ln}}</td>
              <td>{{ props.item.service_name }}</td>
              <td>{{ props.item.store_location }}</td>
              <td>{{ props.item.make }}</td>
              <td>{{ props.item.model }}</td>
              <td>{{ props.item.status_name }}</td>
              <td>{{ wellDate(props.item.date_in) }}</td>
              <td>{{ wellDate(props.item.date_out) }}</td>
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
            <v-layout row wrap justify-space-between>
              <v-flex xs12 sm5>
                <v-autocomplete name="cust_id" :items="this.getCustomers.map((value, index) => {return value.cust_fn + ' ' + value.cust_ln + ', id:'+ value.cust_id})" label="Customer" required v-model="item.cust_id" :error-messages="this.getRepairError.cust_id"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm5>
                <v-autocomplete name="staff_id" :items="this.getStaffs.map((value, index) => {return value.staff_fn + ' ' + value.staff_ln + ', id:'+ value.staff_id})" label="Staff" required v-model="item.staff_id" :error-messages="this.getRepairError.staff_id"></v-autocomplete>
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <v-flex xs12 sm5>
                <v-autocomplete name="service_id" :items="this.getServices.map((value, index) => {return value.service_name + ', id:'+ value.service_id})" label="Service" required v-model="item.service_id" :error-messages="this.getRepairError.service_id"></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm5>
                <v-autocomplete name="store_id" :items="this.getStores.map((value, index) => {return value.store_location + ', id:'+ value.store_id})" label="Store" required v-model="item.store_id" :error-messages="this.getRepairError.store_id"></v-autocomplete>
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <v-flex xs12 sm5>
                <v-text-field name="model" label="Model" v-model="item.model" :error-messages="this.getRepairError.model"></v-text-field>
              </v-flex>
              <v-flex xs12 sm5>
                <v-text-field name="make" label="Make" v-model="item.make" :error-messages="this.getRepairError.make"></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm12>
              <v-text-field name="repair_comments" label="Repair Comments" v-model="item.repair_comments" :error-messages="this.getRepairError.repair_comments"></v-text-field>
            </v-flex>

            <v-layout row wrap justify-space-between>
              <v-flex xs12 sm5>
                <v-text-field name="status_name" label="Status Name" v-model="item.status_name" :error-messages="this.getRepairError.status_name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm5>
                <v-text-field name="status_desc" label="Status Desc" v-model="item.status_desc" :error-messages="this.getRepairError.status_desc"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <v-flex xs12 sm5>

                <v-text-field slot="activator" label="Date In" v-model="item.date_in" type="date" :error-messages="this.getRepairError.date_in"></v-text-field>
              </v-flex>
              <v-flex xs12 sm5>
                <v-text-field slot="activator" label="Date Out" v-model="item.date_out" type="date" :error-messages="this.getRepairError.date_out"></v-text-field>

              </v-flex>
            </v-layout>
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
import common from "../../common/index";

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
        { text: "Customer Name", value: "customer_name" },
        { text: "Staff Name", value: "staff_name" },
        { text: "Service Name", value: "service_name" },
        { text: "Store", value: "store_location" },
        { text: "Make", value: "make" },
        { text: "Model", value: "model" },
        { text: "Status Name", value: "status_name" },
        { text: "Date In", value: "date_in" },
        { text: "Date Out", value: "date_out" },
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
      this.$store.dispatch("getRepairList", data);
      this.$store.dispatch("getCustomerList", {});
      this.$store.dispatch("getServiceList", {});
      this.$store.dispatch("getStaffList", {});
      this.$store.dispatch("getStoreList", {});
    },
    openadd() {
      this.diag_title = "Add repair";
      this.diag_type = 0;
      this.diag_flag = true;
      this.resetData();
    },
    openedit(item) {
      this.diag_title = "Edit repair";
      this.diag_type = 1;
      this.diag_flag = true;
      this.item = item;
      this.item = {
        repair_id: this.item.repair_id,
        cust_id: item.cust_fn + " " + item.cust_ln + ", id:" + item.cust_id,
        store_id: item.store_location + ", id:" + item.store_id,
        staff_id: item.staff_fn + " " + item.staff_ln + ", id:" + item.staff_id,
        service_id: item.service_name + ", id:" + item.service_id,
        model: item.model,
        make: item.make,
        repair_comments: item.repair_comments,
        status_name: item.status_name,
        status_desc: item.status_desc,
        status_id: item.status_id,
        date_in: this.wellDate(item.date_in),
        date_out: this.wellDate(item.date_out)
      };
      console.log(item);
    },
    saveData() {
      var data = {
        repair_id: this.item.repair_id,
        cust_id: this.getId(this.item.cust_id),
        store_id: this.getId(this.item.store_id),
        staff_id: this.getId(this.item.staff_id),
        service_id: this.getId(this.item.service_id),
        model: this.item.model,
        make: this.item.make,
        repair_comments: this.item.repair_comments,
        status_name: this.item.status_name,
        status_desc: this.item.status_desc,
        status_id: this.item.status_id,
        date_in: this.item.date_in,
        date_out: this.item.date_out,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      };
      console.log(data);
      if (this.diag_type == 0) {
        this.$store.dispatch("addRepair", data);
      } else {
        this.$store.dispatch("updateRepair", data);
      }
    },
    resetData() {
      this.item = {
        cust_id: "",
        staff_id: "",
        service_id: "",
        store_id: "",
        status_id: "",
        make: "",
        model: "",
        repair_comments: "",
        date_in: "",
        date_out: ""
      };
    },
    deleteYes() {
      this.isDelete = false;
      let data = {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        repair_id: this.delItem.repair_id
      };
      this.$store.dispatch("deleteRepair", data);
    },
    deleteNo() {
      this.isDelete = false;
    },
    deletedata(item) {
      this.isDelete = true;
      this.delItem = item;
    },
    getId(string) {
      if (string == "" || string == undefined) {
        return "";
      } else {
        return string.split(":")[1];
      }
    },
    wellDate(time) {
      let thisTime = common.wellDate(time);
      return thisTime;
    }
  },
  computed: {
    ...mapGetters([
      "getRepairs",
      "getCustomers",
      "getServices",
      "getStores",
      "getStaffs",
      "getRepairError",
      "getRepairCreatedFlag"
    ])
  },
  watch: {
    getRepairCreatedFlag: function(newValue) {
      console.log(newValue);
      if (newValue) {
        this.diag_flag = false;
      }
    }
  }
};
</script>
