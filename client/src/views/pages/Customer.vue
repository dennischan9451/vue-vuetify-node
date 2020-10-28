<template>
    <div>
        <!-- <page-title-bar></page-title-bar> -->
        <app-section-loader :status="loader"></app-section-loader>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <app-card :heading="$t('message.customer_title')" :fullBlock="true" colClasses="xl12 lg12 md12 sm12 xs12">
                    <div class="pa-3">
                        <v-btn raised color="primary" @click.stop="openadd">Add</v-btn>
                    </div>
                    <v-data-table v-bind:headers="headers" :items="this.getCustomers">
                        <template slot="items" slot-scope="props">
                            <td>{{ props.index + 1 + pagenum * pagesize }}</td>
                            <td>{{ props.item.cust_fn }}</td>
                            <td>{{ props.item.cust_ln }}</td>
                            <td>{{ props.item.email }}</td>
                            <td>{{ props.item.phone }}</td>
                            <td>
                                <v-btn outline class="w-100 rounded-lg" color="info" @click.stop="showAddr(props.item.addresses)">address</v-btn>
                            </td>
                            <td>
                                <v-btn outline class="w-100 rounded-lg" color="info" @click.stop="showRepair(props.item.repairs)">repair</v-btn>
                            </td>
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

            <!-- show customer addresses -->
            <v-dialog v-model="addr_flag" max-width="1200">
                <v-card>
                    <v-card-title class="headline ml-2">Custom addresses</v-card-title>
                    <v-card-actions>
                        <v-data-table v-bind:headers="addr_headers" :items="show_addrs" class="w-100">
                            <template slot="items" slot-scope="props">
                                <td>{{ props.index + 1 + addr_pagenum * addr_pagesize }}</td>
                                <td>{{ props.item.address_1 }}</td>
                                <td>{{ props.item.address_2 }}</td>
                                <td>{{ props.item.city }}</td>
                                <td>{{ props.item.state }}</td>
                                <td>{{ props.item.zip_code }}</td>
                            </template>
                        </v-data-table>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- show repairs -->
            <v-dialog v-model="repair_flag" max-width="1200">
                <v-card>
                    <v-card-title class="headline ml-2">Repairs</v-card-title>
                    <v-card-actions>
                        <v-data-table v-bind:headers="repair_headers" :items="show_repairs" class="w-100">
                            <template slot="items" slot-scope="props">
                                <td>{{ props.index + 1 + addr_pagenum * addr_pagesize }}</td>
                                <td>{{ props.item.staff_fn + ' ' + props.item.staff_ln}}</td>
                                <td>{{ props.item.service_name }}</td>
                                <td>{{ props.item.store_location }}</td>
                                <td>{{ props.item.make }}</td>
                                <td>{{ props.item.model }}</td>
                                <td>{{ props.item.status_name }}</td>
                                <td>{{ wellDate(props.item.date_in) }}</td>
                                <td>{{ wellDate(props.item.date_out) }}</td>

                            </template>
                        </v-data-table>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <!-- open add or edit customer -->
            <v-dialog v-model="diag_flag" max-width="700">
                <v-card>
                    <v-card-title class="headline ml-2">{{diag_title}}</v-card-title>
                    <v-card-title class="headline ml-2 mr-2">
                        <v-card class="address_card border-0">
                            <v-layout row wrap justify-space-between>
                                <v-flex xs12 sm5>
                                    <v-text-field name="cust_fn" label="First Name" v-model="item.cust_fn" :error-messages="this.getCustomerError.cust_fn"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm5>
                                    <v-text-field name="cust_ln" label="Last Name" v-model="item.cust_ln" :error-messages="this.getCustomerError.cust_ln"></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap justify-space-between>
                                <v-flex xs12 sm5>
                                    <v-text-field name="email" label="Email" v-model="item.email" :error-messages="this.getCustomerError.email"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm5>
                                    <v-text-field name="phone" label="Phone" v-model="item.phone" :error-messages="this.getCustomerError.phone"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-card>
                        <!-- Addresses -->
                        <v-card v-for="(addr, index) in item.addresses" v-bind:key="index" class="address_card">
                            <v-layout row wrap justify-space-between>
                                <v-flex xs12 sm5>
                                    <v-text-field name="address_1" label="Address 1" v-model="addr.address_1"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm5>
                                    <v-text-field name="address_2" label="Address 2" v-model="addr.address_2"></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap justify-space-between>
                                <v-flex xs12 sm5>
                                    <v-text-field name="city" label="City" v-model="addr.city"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm5>
                                    <v-text-field name="state" label="State" v-model="addr.state"></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap justify-space-between align-items-center>
                                <v-flex xs12 sm9>
                                    <v-text-field name="zip_code" label="Zip Code" v-model="addr.zip_code" :rules="max10chars"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm2>
                                    <v-btn color="error" flat="flat" @click.native="deleteAddr(index)">Delete</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-card-title>

                    <v-card-actions class="">
                        <v-btn color="info" flat="flat" @click.native="addAddr">Add Address</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="success" flat="flat" @click.native="saveData">Save</v-btn>
                        <v-btn color="error" flat="flat" @click.native="resetData">Reset</v-btn>
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
        { text: "First Name", value: "cust_fn" },
        { text: "Last Name", value: "cust_ln" },
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        {
          text: "Customer Address",
          sortable: false,
          value: "customer_address",
          align: "center"
        },
        {
          text: "Repairs",
          sortable: false,
          value: "repair",
          align: "center"
        },
        { text: "Action", value: "action" }
      ],
      addr_headers: [
        {
          text: "No",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "Address 1", value: "address_1" },
        { text: "Address 2", value: "address_2" },
        { text: "City", value: "city" },
        { text: "State", value: "state" },
        { text: "Zip Code", value: "zip_code" }
      ],
      repair_headers: [
        {
          text: "No",
          align: "left",
          sortable: false,
          value: "id"
        },
        { text: "Staff Name", value: "staff_name" },
        { text: "Service Name", value: "service_name" },
        { text: "Store", value: "store_location" },
        { text: "Make", value: "make" },
        { text: "Model", value: "model" },
        { text: "Status Name", value: "status_name" },
        { text: "Date In", value: "date_in" },
        { text: "Date Out", value: "date_out" }
      ],
      items: [],
      item: {},

      diag_flag: false,
      diag_title: "Add customer",
      diag_type: 0, // 0: add, 1: update
      pagenum: 0,
      pagesize: "",
      isDelete: false,
      delItem: {},
      addr_flag: false,
      repair_flag: false,
      show_addrs: [],
      show_repairs: [],
      addr_pagenum: 0,
      addr_pagesize: "",
      max10chars: [
        v => v.length <= 10 || "Zip Code must be less than 10 charactors"
      ]
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
      this.$store.dispatch("getCustomerList", data);
    },
    addAddr() {
      this.item.addresses.push({
        address_1: "",
        address_2: "",
        city: "",
        zip_code: "",
        state: "",
        cust_id: ""
      });
    },
    showAddr(addresses) {
      this.addr_flag = true;
      this.show_addrs = addresses;
      console.log(addresses);
    },
    showRepair(repairs) {
      this.repair_flag = true;
      this.show_repairs = repairs;
    },
    deleteAddr(index) {
      this.item.addresses.splice(index, 1);
    },
    openadd() {
      this.$store.dispatch("resetCustomerErrors", {});
      this.diag_title = "Add customer";
      this.diag_type = 0;
      this.diag_flag = true;
      this.resetData();
    },
    openedit(item) {
      this.$store.dispatch("resetCustomerErrors", {});
      this.diag_title = "Edit customer";
      this.diag_type = 1;
      this.diag_flag = true;
      this.item = {
        cust_fn: item.cust_fn,
        cust_ln: item.cust_ln,
        email: item.email,
        phone: item.phone,
        cust_id: item.cust_id,
        addresses: []
      };

      item.addresses.map(addr => {
        this.item.addresses.push({
          address_1: addr.address_1,
          address_2: addr.address_2,
          city: addr.city,
          state: addr.state,
          zip_code: addr.zip_code
        });
      });
    },
    saveData() {
      var data = {
        cust_fn: this.item.cust_fn,
        cust_ln: this.item.cust_ln,
        email: this.item.email,
        phone: this.item.phone,
        addresses: this.item.addresses,
        cust_id: this.item.cust_id,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      };
      if (this.diag_type == 0) {
        this.$store.dispatch("addCustomer", data);
      } else {
        this.$store.dispatch("updateCustomer", data);
      }
    },
    resetData() {
      this.item = {
        cust_fn: "",
        cust_ln: "",
        email: "",
        phone: "",
        addresses: []
      };
    },
    deleteYes() {
      this.isDelete = false;
      let data = {
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        cust_id: this.delItem.cust_id
      };
      this.$store.dispatch("deleteCustomer", data);
    },
    deleteNo() {
      this.isDelete = false;
    },
    deletedata(item) {
      this.isDelete = true;
      this.delItem = item;
    },
    wellDate(time) {
      let thisTime = common.wellDate(time);
      return thisTime;
    }
  },
  computed: {
    ...mapGetters([
      "getCustomers",
      "getCustomerError",
      "getCustomerCreatedFlag"
    ])
  },
  watch: {
    getCustomerCreatedFlag: function(newValue) {
      if (newValue) {
        this.diag_flag = false;
      }
    }
  }
};
</script>

<style scoped>
.address_card {
  width: 100%;
  padding: 10px;
  border: 1px solid #bfa5a5;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: none;
}
.rounded-lg {
  border-radius: 10px;
}
</style>
