<template>
  <div>
    <b-container class="mt-5">
      <b-row>
        <b-col md="6" offset-md="3">
          <div class="bg-white shadow-sm p-4 rounded-sm">
            <h1 class="mb-4">Log In</h1>
            <div v-if="errorMessage" class="mb-4">
              <b-alert variant="danger" show>{{ errorMessage }}</b-alert>
            </div>
            <b-form @submit.prevent="signIn()">
              <b-form-group label="Email" label-for="email">
                <b-form-input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Password" label-for="password">
                <b-form-input
                  id="password"
                  v-model="form.password"
                  required
                  placeholder="Enter password"
                  type="password"
                ></b-form-input>
              </b-form-group>
              <div class="d-flex">
                <div class="mr-3">
                  <b-button type="submit" variant="primary" :disabled="busy">
                    <span v-if="busy" class="mr-2">
                      <b-spinner small label="Submitting..." />
                    </span>
                    <span>{{ busy ? 'Logging in...' : 'Log In' }}</span>
                  </b-button>
                </div>
                <div>
                  <b-button variant="link" to="#"> Forgot Password </b-button>
                </div>
              </div>
            </b-form>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      errorMessage: null,
      busy: false,
    }
  },
  methods: {
    signIn() {
      this.busy = true
      this.errorMessage = 'User not found.'
    },
  },
}
</script>
