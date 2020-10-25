<template>
  <div>
    <!-- <page-title-bar></page-title-bar> -->
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <app-card :heading="$t('message.staff_title')" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
          <div class="pa-3">
            <v-btn raised color="primary" @click.stop="openadd">Add</v-btn>
          </div>
          <v-data-table v-bind:headers="headers" :items="this.getStaffs">
            <template slot="items" slot-scope="props">
              <td>{{ props.index + 1 }}</td>
              <td>{{ props.item.staff_fn }}</td>
              <td>{{ props.item.staff_ln }}</td>
              <td>{{ props.item.staff_email }}</td>
              <td>{{ props.item.staff_status_name }}</td>
              <td>{{ props.item.staff_status_desc }}</td>
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
                <v-text-field name="staff_fn" label="First Name" v-model="item.staff_fn" :error-messages="this.getStaffError.staff_fn"></v-text-field>
              </v-flex>
              <v-flex xs12 sm5>
                <v-text-field name="staff_ln" label="Last Name" v-model="item.staff_ln" :error-messages="this.getStaffError.staff_ln"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <v-flex xs12 sm5>
                <v-text-field name="staff_email" label="Staff Email" v-model="item.staff_email" :error-messages="this.getStaffError.staff_email"></v-text-field>
              </v-flex>
              <v-flex xs12 sm5>
                <v-text-field name="staff_status_name" label="Staff Status Name" v-model="item.staff_status_name" :error-messages="this.getStaffError.staff_status_name"></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex xs12 sm12>
              <v-text-field name="staff_status_desc" label="Staff Status Description" v-model="item.staff_status_desc" :error-messages="this.getStaffError.staff_status_desc"></v-text-field>
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
        { text: "First Name", value: "staff_fn" },
        { text: "Last Name", value: "staff_ln" },
        { text: "Email", value: "staff_email" },
        { text: "Status Name", value: "staff_status_name" },
        { text: "Status Desc", value: "staff_status_desc" },
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
      this.$store.dispatch("getStaffList", data);
    },
    openadd() {
      this.diag_title = "Add staff";
      this.diag_type = 0;
      this.diag_flag = true;
      this.resetData();
    },
    openedit(item) {
      this.diag_title = "Edit staff";
      this.diag_type = 1;
      this.diag_flag = true;
      this.item = {
        staff_id: item.staff_id,
        staff_fn: item.staff_fn,
        staff_ln: item.staff_ln,
        staff_status_name: item.staff_status_name,
        staff_email: item.staff_email,
        staff_status_desc: item.staff_status_desc,
        staff_status_id: item.staff_status_id
      };
    },
    saveData() {
      var data = {
        staff_id: this.item.staff_id,
        staff_fn: this.item.staff_fn,
        staff_ln: this.item.staff_ln,
        staff_status_name: this.item.staff_status_name,
        staff_email: this.item.staff_email,
        staff_status_desc: this.item.staff_status_desc,
        staff_status_id: this.item.staff_status_id,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      };
      if (this.diag_type == 0) {
        this.$store.dispatch("addStaff", data);
      } else {
        this.$store.dispatch("updateStaff", data);
      }
    },
    resetData() {
      this.item = {
        staff_fn: "",
        staff_ln: "",
        staff_email: "",
        staff_status_name: "",
        staff_status_desc: ""
      };
    },
    deleteYes() {
      this.isDelete = false;
      let data = {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        staff_id: this.delItem.staff_id
      };
      this.$store.dispatch("deleteStaff", data);
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
    ...mapGetters(["getStaffs", "getStaffError", "getStaffCreatedFlag"])
  },
  watch: {
    getStaffCreatedFlag: function(newValue) {
      console.log(newValue);
      if (newValue) {
        this.diag_flag = false;
      }
    }
  }
};
</script>
