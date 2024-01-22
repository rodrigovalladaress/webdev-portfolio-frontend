<template>
  <div class="contact-wrapper d-flex justify-content-center">
    <div class="background-wrapper bg-black-a-80">
      <div class="form-wrapper border-2-white" :class="{ 'form-submitted': isFormSubmitted }">
        <h1 class="h2 lowercase text-bold">Contact</h1>

        <form :class="{ loading: isLoading }" action="#" method="post" @submit.prevent="onFormSubmit">
          <input v-model="formData.botcheck" type="checkbox" name="contact-by-phone" style="display: none" />

          <div class="two-columns d-flex-md">
            <div class="form-group">
              <label class="flex wrap mono-font">
                <div class="lowercase">Name</div>

                <input v-model="formData.name" name="name" type="text" placeholder="write your name" required />
              </label>
            </div>

            <div class="form-group">
              <label class="flex wrap mono-font">
                <div class="lowercase">Email</div>

                <input v-model="formData.email" name="email" type="email" placeholder="write your email" required />
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="flex wrap mono-font">
              <div class="lowercase">message</div>

              <textarea v-model="formData.message" name="message" placeholder="write your message" rows="5"></textarea>
            </label>
          </div>

          <div class="form-group submit-form-group d-flex align-items-center">
            <input type="submit" class="btn" value="Send message" required :disabled="isLoading" />

            <div class="icon d-flex align-items-center">
              <LoadingIcon view-box=""></LoadingIcon>
            </div>
          </div>

          <div ref="error" class="error">
            {{ errorMessage }}
          </div>
        </form>

        <div ref="thankYou" class="thank-you d-flex justify-content-center align-items-center">
          <div class="message h1 mono-font text-color-black">Thanks for your message!</div>
        </div>
      </div>

      <div class="additional-contact">
        You can also contact me on <a href="#" class="link" target="_blank">LinkedIn</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoadingIcon from "~/assets/images/Loading.svg?component";

definePageMeta({
  title: "Contact",
  order: 2,
});

const config = useRuntimeConfig();
const { isDevelopment: dev } = useEnvironment();

const error = ref<HTMLDivElement | null>(null);
const thankYou = ref<HTMLDivElement | null>(null);
const errorMessage = ref("");
const isLoading = ref(false);
const isFormSubmitted = ref(false);

const formData = {
  botcheck: false,
  name: dev ? "Test" : "",
  email: dev ? "test@email.com" : "",
  message: dev ? "Godzilla" : "",
};

const scrollTo = (el: HTMLElement | null) => {
  if (!el) {
    return;
  }

  el.scrollIntoView({ behavior: "smooth" });
};

const scrollToError = () => {
  scrollTo(error.value);
};

const scrollToThankYou = () => {
  scrollTo(thankYou.value);
};

const onFormSubmit = async (_payload: Event) => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  let responseErrorMessage = "";
  const { status, error } = await useFetch("https://api.web3forms.com/submit", {
    method: "post",
    body: { access_key: config.public.web3FormsKey, ...formData },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    onResponseError({ response }) {
      responseErrorMessage = (response._data as { message?: string })?.message || "";
    },
  });

  switch (status.value) {
    case "success":
      isFormSubmitted.value = true;

      scrollToThankYou();
      break;

    case "error":
      // eslint-disable-next-line no-console
      console.error(error.value, responseErrorMessage);
      errorMessage.value =
        `Something wrong happened. Please try again later or use the link below. ` +
        (responseErrorMessage ? `The error message was: ${responseErrorMessage}` : "");

      scrollToError();
      break;
  }

  isLoading.value = false;
};
</script>

<style lang="scss" scoped>
@use "sass:color";

h1 {
  line-height: 1;
}

.background-wrapper {
  backdrop-filter: blur(2px);

  @include media(md) {
    max-width: 67.6rem;
    padding: 3rem;
  }
}

.form-wrapper {
  padding: 3.6rem;
  position: relative;
}

form {
  margin-top: 3.8rem;

  @include media(md) {
    margin-top: 2.3rem;
  }
}

.form-group {
  margin-top: 3rem;
}

.two-columns {
  @include media(md) {
    gap: 2rem;

    > * {
      width: 50%;
    }
  }
}

label {
  line-height: 1;
  font-size: 2rem;

  > * {
    width: 100%;
  }
}

input,
textarea {
  outline: 1px $text-color solid;
  border: none;
  color: $text-color;
  background-color: $bg-black;
  font-size: 2rem;
  margin-top: 1rem;
  line-height: 1;
  padding: 0.5rem 1rem;

  &::placeholder {
    color: $text-placeholder-color;
  }

  &:active,
  &:focus {
    outline-style: dashed;
    outline-width: 2px;
  }
}

.submit-form-group {
  margin-top: 3.6rem;
  gap: 1rem;
}

[type="submit"] {
  // margin-top: 2.6rem;
  margin: 0;
}

.icon {
  width: 3rem;
  height: auto;
  opacity: 0;
  transition: opacity 100ms ease-in-out;
}

.error {
  margin-top: 2rem;
  color: $error;
}

form.loading {
  .icon {
    opacity: 1;
  }
}

.additional-contact {
  padding: 1rem 2rem;

  @include media(md) {
    padding-right: 0;
    padding-bottom: 0;
    padding-left: 0;
  }
}

$thank-you-color: color.change($primary, $saturation: 80%);

.thank-you {
  position: absolute;
  inset: 0;
  background-color: $thank-you-color;
  pointer-events: none;
  opacity: 0;
  transition: opacity 500ms ease-in-out;

  .message {
    text-align: center;
  }
}

.form-wrapper.form-submitted {
  border-color: $thank-you-color;

  .thank-you {
    pointer-events: all;
    opacity: 1;
  }
}
</style>
