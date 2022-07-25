<template>
  <main>
    <navbar-navigation />
    <div class="container-post container">
      <div class="post-card" v-for="i of [1, 2, 3]" :key="i">
        <div class="hearder-post-card">
          <div class="post-card-avatar"></div>
          <div class="title-name-post-card">
            <div class="title-post">Mes dernières vacances</div>
            <div class="post-name">
              <div class="post-firstname">Morgan</div>
              <div class="post-lastname">Tappret</div>
            </div>
          </div>
        </div>
        <div class="post-card-picture">
          <img src="@/assets/images/beach.png" alt="" />
        </div>
        <div class="footer-post-card">
          <div class="text-contain">
            <span class="text-post-card">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum,
              amet est. Repudiandae ratione in est id iste at minus velit
              similique magnam quod aliquam, cumque incidunt commodi vitae
              veritatis necessitatibus!
            </span>
          </div>
          <div class="footer-group-icon">
            <div class="footer-left-icon">
              <i @click="addComment" class="fa-solid fa-comment-dots"></i>
              <i class="fa-solid fa-thumbs-up"></i>
            </div>
            <div class="footer-right-icon">
              <i class="fa-solid fa-pen"></i>
              <i class="fa-solid fa-trash-can"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import NavbarNavigation from "@/components/NavbarNavigation.vue";
export default {
  components: { NavbarNavigation },
  methods: {
    addComment(e) {
      console.log(e);
      this.$router.push({ path: "/comments" });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.container-post {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .post-card {
    // border: 1px solid black;
    border-radius: 1rem;
    box-shadow: $secondary() 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px,
      rgba(17, 17, 26, 0.1) 0px 16px 56px;
    .hearder-post-card {
      .title-name-post-card {
        > .title-post {
          gap: $useGap;
          padding: $usePadding;
        }
        .post-name {
          display: flex;
          gap: $useGap;
          padding: $usePadding;
        }
      }
    }
    .post-card-picture {
      display: flex;
      justify-content: center;
      > img {
        width: 100%;
      }
    }
    .footer-post-card {
      padding: $usePadding;
      // background-color: $secondary;
      .text-contain {
        > .text-post-card {
          margin: 0;
        }
      }
      .footer-group-icon {
        display: flex;
        justify-content: space-between;
        .footer-left-icon,
        .footer-right-icon {
          padding: $usePadding;
          display: flex;
          gap: 1rem;
          i {
            font-size: 1.5rem;
          }
        }
      }
    }
  }
}
</style>
