<template>
  <div class="contact-wrapper bg-black-a-80">
    <div class="form-wrapper border-2-white">
      <h1 class="h1 lowercase text-bold">Contact</h1>

      <form action="">
        <div class="form-group">
          <label class="flex wrap mono-font">
            <div class="lowercase">Name</div>

            <input name="name" type="text" placeholder="write your name" />
          </label>
        </div>

        <div class="form-group">
          <label class="flex wrap mono-font">
            <div class="lowercase">message</div>

            <textarea name="message" placeholder="write your message" rows="5"></textarea>
          </label>
        </div>

        <div class="form-group">
          <input type="submit" class="btn" value="Send message" />
        </div>
      </form>
    </div>

    <div class="additional-contact">
      You can also contanct me on <a href="#" class="link">LinkedIn</a> or email me at
      <a href="#" class="link">rodriv_tf@hotmail.com</a>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.form-wrapper {
  padding: 3.6rem;
}

.form-group {
  margin-top: 3rem;
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

[type="submit"] {
  margin-top: 3.8rem;
}

.additional-contact {
  padding: 1rem 2rem;
}
</style>
