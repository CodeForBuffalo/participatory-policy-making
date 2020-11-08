<template>
  <div>
    <b-container class="mt-5">
      <b-row>
        <b-col>
          <b-table
            striped
            bordered
            hover
            small
            :fields="table.fields"
            :items="table.items"
            :busy="table.isBusy"
            :sort-by.sync="table.sortBy"
            :sort-desc.sync="table.sortDesc"
          >
            <template #table-busy>
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>
            <template #cell(edit)="data">
              <router-link :to="`/modify#${data.index}`">Modify</router-link>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'DashbordPage',
  data() {
    return {
      table: {
        isBusy: false,
        sortBy: 'publishedOn',
        sortDesc: false,
        fields: [
          { key: 'title', sortable: true },
          { key: 'publishedOn', sortable: true, tdClass: 'text-right' },
          { key: 'commentEndDate', sortable: true, tdClass: 'text-right' },
          { key: 'comments', sortable: true, tdClass: 'text-right' },
          { key: 'edit', label: '', sortable: false },
        ],
        items: [
          {
            title: 'A Really Great Title',
            publishedOn: '11/12/2020',
            commentEndDate: '12/12/2020',
            comments: 34,
          },
          {
            title: 'A Really Great Title',
            publishedOn: '11/12/2020',
            commentEndDate: '12/12/2020',
            comments: 34,
          },
          {
            title: 'A Really Great Title',
            publishedOn: '11/12/2020',
            commentEndDate: '12/12/2020',
            comments: 34,
          },
          {
            title: 'A Really Great Title',
            publishedOn: '11/12/2020',
            commentEndDate: '12/12/2020',
            comments: 34,
          },
        ],
      },
    }
  },
  methods: {
    toggleBusy() {
      this.isBusy = !this.isBusy
    },
  },
}
</script>
