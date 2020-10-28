<template>
  <div>
    <!-- <page-title-bar></page-title-bar> -->
    <app-section-loader :status="loader"></app-section-loader>
    <v-container fluid grid-list-xl>
      <v-layout row wrap>
        <app-card :heading="$t('message.store_title')" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
          <div class="pa-3" v-show="getUser.role == 0">
            <v-btn raised color="primary" @click.stop="openadd">Add</v-btn>
          </div>
          <v-data-table v-bind:headers="headers" :items="this.getStores">
            <template slot="items" slot-scope="props">
              <td>{{ props.index + 1 + pagenum * pagesize }}</td>
              <td>{{ props.item.store_location }}</td>
              <td v-show="getUser.role == 0">
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

      <v-dialog v-model="diag_flag" max-width="500">
        <v-card>
          <v-card-title class="headline ml-2">{{diag_title}}</v-card-title>
          <v-card-title class="headline ml-2 mr-2">
            <v-flex xs12 sm12>
              <v-text-field name="store_location" label="Store Location" v-model="item.store_location" :error-messages="this.getStoreError.store_location"></v-text-field>
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
        { text: "Store Location", value: "store_location" },
        { text: "Action", value: "action" }
      ],
      items: [],
      item: {},

      diag_flag: false,
      diag_title: "",
      diag_type: 0, // 0: add, 1: update
      pagenum: 0,
      pagesize: "",
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
      this.$store.dispatch("getStoreList", data);
    },
    openadd() {
      this.diag_title = "Add Store Location";
      this.diag_type = 0;
      this.diag_flag = true;
      this.resetData();
    },
    openedit(item) {
      this.diag_title = "Edit Store Location";
      this.diag_type = 1;
      this.diag_flag = true;
      this.item = {
        store_location: item.store_location,
        store_id: item.store_id
      };
    },
    saveData() {
      var data = {
        store_location: this.item.store_location,
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        store_id: this.item.store_id
      };
      if (this.diag_type == 0) {
        this.$store.dispatch("addStore", data);
      } else {
        this.$store.dispatch("updateStore", data);
      }
    },
    resetData() {
      this.item = {
        store_location: ""
      };
    },
    deleteYes() {
      this.isDelete = false;
      let data = {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        store_id: this.delItem.store_id
      };
      this.$store.dispatch("deleteStore", data);
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
      "getStores",
      "getStoreError",
      "getStoreCreatedFlag",
      "getUser"
    ])
  },
  watch: {
    getStoreCreatedFlag: function(newValue) {
      if (newValue) {
        this.diag_flag = false;
      }
    }
  }
};
</script>
