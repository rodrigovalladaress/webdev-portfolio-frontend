<template>
  <div class="contact-wrapper">
    <div class="background-wrapper">
      <div class="form-wrapper" :class="{ 'form-submitted': isFormSubmitted }">
        <h1 class="title">Contact</h1>

        <form class="form" :class="{ loading: isLoading }" action="#" method="post" @submit.prevent="onFormSubmit">
          <input v-model="formData.botcheck" type="checkbox" name="contact-by-phone" style="display: none" />

          <div class="two-columns">
            <div class="form-group">
              <label for="contact-form-name" class="form-label">Name</label>

              <input
                id="contact-form-name"
                v-model="formData.name"
                class="form-textbox"
                name="name"
                type="text"
                :placeholder="name"
                required
              />
            </div>

            <div class="form-group">
              <label for="contact-form-email" class="form-label">Email</label>

              <input
                id="contact-form-email"
                v-model="formData.email"
                class="form-textbox"
                name="email"
                type="email"
                :placeholder="`${lowerName}@email.com`"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Message</label>

            <textarea
              v-model="formData.message"
              class="form-textarea"
              name="message"
              :placeholder="`Hi, I'm ${name}.`"
              rows="4"
            ></textarea>
          </div>

          <div class="submit-form-group">
            <input type="submit" class="btn" value="Send message" required :disabled="isLoading" />

            <div class="icon">
              <LoadingIcon view-box=""></LoadingIcon>
            </div>
          </div>

          <div v-if="errorMessage" ref="error" class="error">
            {{ errorMessage }}
          </div>
        </form>

        <div ref="thankYou" class="thank-you">
          <div class="message">Thanks for your message!</div>
        </div>
      </div>

      <div class="additional-contact">
        You can also contact me on <a :href="linkedin" class="link" target="_blank">LinkedIn</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoadingIcon from "~/assets/images/Loading.svg?component";
import { chooseAtRandom } from "~/utils/array";

const RANDOM_NAMES = ["John", "Marika", "Cthulhu", "Vela", "Mario", "Samus", "Frieren", "Laios"];

definePageMeta({
  title: "Contact",
  order: 2,
});

const config = useRuntimeConfig();
const { isDevelopment: dev } = useEnvironment();

const name = ref(chooseAtRandom(RANDOM_NAMES));
const lowerName = ref(name.value.toLowerCase());
const error = ref<HTMLDivElement | null>(null);
const thankYou = ref<HTMLDivElement | null>(null);
const linkedin = ref(config.public.linkedin);
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
.contact-wrapper {
  display: grid;
  place-content: center;
  height: 100%;
  width: 100%;
}

.title {
  font-size: var(--t-h4);
  font-weight: 600;
  margin-block-end: 38px;

  /* @media (--md) {
    margin-block-end: 23px;
  } */

  @media (--lg) {
    margin-block-end: 42px;
    font-size: var(--t-h3);
  }
}

.background-wrapper {
  height: fit-content;
  backdrop-filter: blur(2px);
  background-color: oklch(var(--color-bg-black-value) / 80%);

  @media (--md) {
    max-width: 42rem;
    padding: 30px;
  }
}

.form-wrapper {
  --color-thankyou: var(--color-primary-2);

  position: relative;
  padding: var(--spacing-09) var(--spacing-09) var(--spacing-1);

  @media (--sm) {
    padding: 36px 36px 46px;
    border: 2px solid white;
  }
}

.form {
  --field-gap: 32px;

  display: flex;
  flex-direction: column;
  gap: var(--field-gap);

  @media (--md) {
    --field-gap: 28px;
  }
}

.two-columns {
  display: flex;
  flex-wrap: wrap;
  gap: var(--field-gap);
  justify-content: space-between;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 12rem;
}

.form-label {
  line-height: 1;
  font-size: 1.25rem;
  font-family: var(--font-mono);
  text-transform: lowercase;
}

.form-textbox {
  line-height: 1;
}

.form-textarea {
  line-height: 1.5;
}

.form-textbox,
.form-textarea {
  outline: 1px var(--color-text) solid;
  border: none;
  color: var(--color-text);
  background-color: var(--color-bg-black);
  font-size: 1.25rem;
  margin-block-start: 10px;
  padding: 5px 10px 6px;

  &::placeholder {
    color: var(--color-text-placeholder);
  }

  &:active,
  &:focus {
    outline-style: dashed;
    outline-width: 2px;
  }
}

.submit-form-group {
  display: flex;
  align-items: center;
  gap: 10px;

  /* Add a bit more of spacing above to separate the submit button
  from the form field above  */
  margin-block-start: calc(var(--field-gap) * 0.3);
}

.icon {
  width: 30px;
  height: auto;
  opacity: 0;
  transition: opacity 100ms ease-in-out;
}

.error {
  color: var(--color-error);
  font-size: 1.1rem;
}

form.loading {
  .icon {
    opacity: 1;
  }
}

.additional-contact {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  padding: 16px var(--spacing-09);
  line-height: 1.5;

  @media (--md) {
    padding-inline: 0;
    padding-block-end: 0;
  }
}

.thank-you {
  display: grid;
  place-content: center;
  position: absolute;
  inset: 0;
  font-size: 2.5rem;
  font-family: var(--font-mono);
  color: black;
  background-color: var(--color-thankyou);
  pointer-events: none;
  opacity: 0;
  transition: opacity 500ms ease-in-out;
  padding: 32px;

  .message {
    text-align: center;
  }
}

.form-submitted {
  border-color: var(--color-thankyou);

  .thank-you {
    pointer-events: all;
    opacity: 1;
  }
}
</style>
