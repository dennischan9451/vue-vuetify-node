<template>
  <div>
    <!-- <page-title-bar></page-title-bar> -->
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <app-card :heading="$t('message.employee_title')" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
          <div class="pa-3">
            <v-btn raised color="primary" @click.stop="openadd">Add</v-btn>
          </div>
          <v-data-table v-bind:headers="headers" :items="this.getEmployees">
            <template slot="items" slot-scope="props">
              <td>{{ props.index + 1 + pagenum * pagesize }}</td>
              <td>{{ props.item.first_name }}</td>
              <td>{{ props.item.last_name }}</td>
              <td>{{ props.item.email }}</td>
              <td>{{ roles[props.item.role] }}</td>
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
                <v-text-field name="first_name" label="First Name" v-model="item.first_name" :error-messages="this.getEmployeeError.first_name"></v-text-field>
              </v-flex>
              <v-flex xs12 sm5>
                <v-text-field name="last_name" label="Last Name" v-model="item.last_name" :error-messages="this.getEmployeeError.last_name"></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-space-between>
              <v-flex xs12 sm5>
                <v-text-field name="email" label="Employee Email" v-model="item.email" :error-messages="this.getEmployeeError.email"></v-text-field>
              </v-flex>
              <v-flex xs12 sm5>
                <v-text-field name="password" label="Password" v-model="item.password" :error-messages="this.getEmployeeError.password"></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex xs12>
              <v-switch label="Admin" v-model="item.role" color="success" hide-details>
              </v-switch>
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
        { text: "First Name", value: "first_name" },
        { text: "Last Name", value: "last_name" },
        { text: "Email", value: "email" },
        { text: "Role", value: "role" },
        { text: "Action", value: "action" }
      ],
      items: [],
      item: {},

      diag_flag: false,
      diag_title: "",
      diag_type: 0, // 0: add, 1: update
      pagenum: 0,
      pagesize: "",
      roles: ["Admin", "User"],
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
      this.$store.dispatch("getEmployeeList", data);
    },
    openadd() {
      this.$store.dispatch("resetEmployErrors", {});
      this.diag_title = "Add employee";
      this.diag_type = 0;
      this.diag_flag = true;
      this.resetData();
    },
    openedit(item) {
      this.$store.dispatch("resetEmployErrors", {});
      this.diag_title = "Edit employee";
      this.diag_type = 1;
      this.diag_flag = true;
      this.item = {
        admin_id: item.admin_id,
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        password: "",
        role: item.role == 0 ? true : false
      };
    },
    saveData() {
      var data = {
        admin_id: this.item.admin_id,
        first_name: this.item.first_name,
        last_name: this.item.last_name,
        password: this.item.password,
        email: this.item.email,
        role: this.item.role == true ? 0 : 1,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      };
      if (this.diag_type == 0) {
        this.$store.dispatch("addEmployee", data);
      } else {
        this.$store.dispatch("updateEmployee", data);
      }
    },
    resetData() {
      this.item = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: 0
      };
    },
    deleteYes() {
      this.isDelete = false;
      let data = {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        admin_id: this.delItem.admin_id
      };
      this.$store.dispatch("deleteEmployee", data);
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
    ...mapGetters([
      "getEmployees",
      "getEmployeeError",
      "getEmployeeCreatedFlag"
    ])
  },
  watch: {
    getEmployeeCreatedFlag: function(newValue) {
      if (newValue) {
        this.diag_flag = false;
      }
    }
  }
};
</script>
