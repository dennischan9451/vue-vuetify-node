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
                            <td>{{ props.item.address_1 }}</td>
                            <td>{{ props.item.address_2 }}</td>
                            <td>{{ props.item.city }}</td>
                            <td>{{ props.item.zip_code }}</td>
                            <td>{{ props.item.state }}</td>
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

            <v-dialog v-model="diag_flag" max-width="700">
                <v-card>
                    <v-card-title class="headline ml-2">{{diag_title}}</v-card-title>
                    <v-card-title class="headline ml-2 mr-2">
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
                        <v-layout row wrap justify-space-between>
                            <v-flex xs12 sm5>
                                <v-text-field name="address_1" label="Address 1" v-model="item.address_1" :error-messages="this.getCustomerError.address_1"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm5>
                                <v-text-field name="address_2" label="Address 2" v-model="item.address_2" :error-messages="this.getCustomerError.address_2"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap justify-space-between>
                            <v-flex xs12 sm5>
                                <v-text-field name="city" label="City" v-model="item.city" :error-messages="this.getCustomerError.city"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm5>
                                <v-text-field name="state" label="State" v-model="item.state" :error-messages="this.getCustomerError.state"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-flex xs12 sm12>
                            <v-text-field name="zip_code" label="Zip Code" v-model="item.zip_code" :error-messages="this.getCustomerError.zip_code"></v-text-field>
                        </v-flex>
                    </v-card-title>

                    <v-card-actions>

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
        { text: "Address 1", value: "address_1" },
        { text: "Address 2", value: "address_2" },
        { text: "City", value: "city" },
        { text: "Zip_Code", value: "zip_code" },
        { text: "State", value: "state" },
        { text: "Action", value: "action" }
      ],
      items: [],
      item: {},

      diag_flag: false,
      diag_title: "Add customer",
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
      this.$store.dispatch("getCustomerList", data);
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
        address_1: item.address_1,
        address_2: item.address_2,
        city: item.city,
        zip_code: item.zip_code,
        state: item.state,
        cust_id: item.cust_id,
        address_id: item.address_id
      };
    },
    saveData() {
      var data = {
        cust_fn: this.item.cust_fn,
        cust_ln: this.item.cust_ln,
        email: this.item.email,
        phone: this.item.phone,
        address_1: this.item.address_1,
        address_2: this.item.address_2,
        city: this.item.city,
        zip_code: this.item.zip_code,
        state: this.item.state,
        cust_id: this.item.cust_id,
        pagenum: this.pagenum,
        pagesize: this.pagesize,
        address_id: this.item.address_id
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
