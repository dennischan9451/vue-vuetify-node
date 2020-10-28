<template>
  <div>
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid grid-list-xl>
      <!-- Repair Status -->
      <v-layout row wrap>
        <app-card :heading="$t('message.repairstatus')" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
          <div class="pa-3">
            <v-btn raised color="primary" @click.stop="openadd(0)">Add</v-btn>
          </div>
          <v-data-table v-bind:headers="headers" :items="this.getRepairStatus">
            <template slot="items" slot-scope="props">
              <td>{{ props.index + 1 + repair_pagenum * repair_pagesize }}</td>
              <td>{{ props.item.status_name }}</td>
              <td>{{ props.item.status_desc }}</td>
              <td>
                <v-btn flat icon small @click.stop="openedit(props.item, statustype = 0)">
                  <v-icon class="font-md">ti-pencil</v-icon>
                </v-btn>
                <v-btn flat icon small @click.stop="deletedata(props.item, statustype = 0)">
                  <v-icon class="font-md">ti-trash</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </app-card>
      </v-layout>

      <!-- Staff Status -->
      <v-layout row wrap>
        <app-card :heading="$t('message.staffstatus')" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
          <div class="pa-3">
            <v-btn raised color="primary" @click.stop="openadd(1)">Add</v-btn>
          </div>
          <v-data-table v-bind:headers="headers" :items="this.getStaffStatus">
            <template slot="items" slot-scope="props">
              <td>{{ props.index + 1 + repair_pagenum * repair_pagesize }}</td>
              <td>{{ props.item.staff_status_name }}</td>
              <td>{{ props.item.staff_status_desc }}</td>
              <td>
                <v-btn flat icon small @click.stop="openedit(props.item, statustype= 1 )">
                  <v-icon class="font-md">ti-pencil</v-icon>
                </v-btn>
                <v-btn flat icon small @click.stop="deletedata(props.item, statustype = 1)">
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
              <v-text-field name="status_name" label="Status Name" v-model="item.status_name" :error-messages="this.getStatusError.status_name"></v-text-field>
            </v-flex>

            <v-flex xs12 sm12>
              <v-text-field name="status_desc" label="Status Description" v-model="item.status_desc" :error-messages="this.getStatusError.status_desc"></v-text-field>
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
        { text: "Status Name", value: "status_name" },
        { text: "Description", value: "status_desc" },
        { text: "Action", value: "action" }
      ],
      items: [],
      item: {},

      diag_flag: false,
      diag_title: "",
      diag_type: 0, // 0: add, 1: update
      repair_pagenum: 0,
      staff_pagenum: 0,
      repair_pagesize: "",
      staff_pagesize: "",
      isDelete: false,
      delItem: {},
      statustype: 0 // repair: 0, staff: 1
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
        pagenum: this.repair_pagenum,
        pagesize: this.repair_pagesize
      };
      this.$store.dispatch("getRepairStatusList", data);
      data = {
        pagenum: this.staff_pagenum,
        pagesize: this.staff_pagesize
      };
      this.$store.dispatch("getStaffStatusList", data);
    },
    openadd(statustype) {
      this.statustype = statustype;
      this.$store.dispatch("resetStatusErrors", {});
      if (statustype == 0) {
        this.diag_title = "Add repair status";
      } else {
        this.diag_title = "Add staff status";
      }
      this.diag_type = 0;
      this.diag_flag = true;
      this.resetData();
    },
    openedit(item, statustype) {
      this.$store.dispatch("resetStatusErrors", {});
      this.diag_title = "Edit status";
      this.diag_type = 1;
      this.diag_flag = true;
      this.statustype = statustype;
      if (statustype == 0) {
        this.item = {
          status_id: item.status_id,
          status_name: item.status_name,
          status_desc: item.status_desc
        };
      } else {
        this.item = {
          status_id: item.staff_status_id,
          status_name: item.staff_status_name,
          status_desc: item.staff_status_desc
        };
      }
    },
    saveData() {
      var data = {};
      if (this.statustype == 0) {
        data = {
          status_id: this.item.status_id,
          status_name: this.item.status_name,
          status_desc: this.item.status_desc,
          pagenum: this.repair_pagenum,
          pagesize: this.repair_pagesize,
          statustype: 0
        };
      } else {
        data = {
          staff_status_id: this.item.status_id,
          staff_status_name: this.item.status_name,
          staff_status_desc: this.item.status_desc,
          pagenum: this.staff_pagenum,
          pagesize: this.staff_pagesize,
          statustype: 1
        };
      }

      if (this.diag_type == 0) {
        this.$store.dispatch("addStatus", data);
      } else {
        this.$store.dispatch("updateStatus", data);
      }
    },
    resetData() {
      this.item = {
        status_name: "",
        status_desc: ""
      };
    },
    deleteYes() {
      this.isDelete = false;
      let data = {};
      if (this.statustype == 0) {
        data = {
          pagenum: this.repair_pagenum,
          pagesize: this.repair_pagesize,
          status_id: this.delItem.status_id,
          statustype: 0
        };
      } else {
        data = {
          pagenum: this.staff_pagenum,
          pagesize: this.staff_pagesize,
          staff_status_id: this.delItem.staff_status_id,
          statustype: 1
        };
      }

      this.$store.dispatch("deleteStatus", data);
    },
    deleteNo() {
      this.isDelete = false;
    },
    deletedata(item, statustype) {
      this.isDelete = true;
      this.delItem = item;
      this.statustype = statustype;
    }
  },
  computed: {
    ...mapGetters([
      "getRepairStatus",
      "getStaffStatus",
      "getStatusError",
      "getStatusCreatedFlag"
    ])
  },
  watch: {
    getStatusCreatedFlag: function(newValue) {
      if (newValue) {
        this.diag_flag = false;
      }
    }
  }
};
</script>
