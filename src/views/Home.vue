<template>
  <div>
    <div class="content" :class="(minusTime)?'red':'white'">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <p class="minus" v-if="minusTime">-</p>
      <p class="minutes">{{minusTime?minutesLeft-1:minutesLeft}}</p>
      <p class="colon">:</p>
      <p class="seconds">{{secondsLeft}}</p>
    </div>
    <p class="name">{{itemName}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      itemName: "",
      minusTime: false,
      itemLength: null,
      timeNow: null,
      startTime: 0,
      plan: null,
      currentItemTime: null
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      window.setInterval(() => {
        this.timeNow = new Date().setTime(new Date().getTime());
      }, 1000);
    });
  },
  computed: {
    timeLeft: function() {
      if (this.itemLength !== null) {
        return this.itemLength + (this.startTime - this.timeNow) / 1000;
      }
    },
    minutesLeft: function() {
      if (this.timeLeft > 60 || this.timeLeft < 60) {
        var timeLeftMinutes = Math.floor(this.timeLeft / 60);
        return Math.abs(timeLeftMinutes);
      }
      return 0;
    },
    secondsLeft: function() {
      if (this.timeLeft !== undefined) {
        if (this.timeLeft > 60 || this.timeLeft < 60) {
          var timeLeftSeconds = Math.floor(this.timeLeft % 60);
          if (timeLeftSeconds < 0) {
            this.minusTime = true;
          } else {
            this.minusTime = false;
          }
          if (Math.floor(Math.abs(timeLeftSeconds)) < 10) {
            return "0" + Math.floor(Math.abs(timeLeftSeconds));
          }
          return Math.floor(Math.abs(timeLeftSeconds));
        }
        if (this.timeLeft < 0) {
          this.minusTime = true;
        } else {
          this.minusTime = false;
        }
        if (Math.floor(Math.abs(this.timeLeft)) < 10) {
          return "0" + Math.floor(Math.abs(this.timeLeft));
        }
        return Math.floor(Math.abs(this.timeLeft));
      }
      return 0;
    }
  },

  created() {
    this.getCurrentPlan();
  },
  methods: {
    async getCurrentPlan() {
      const response = await fetch(
        "https://api.planningcenteronline.com/services/v2/service_types/227874/plans?order=-sort_date",
        {
          headers: {
            Authorization:
              "Basic MzRmMzY5OWNkMmFkZjc3YmFmOTNlMDJlZjUyYjU3YTYxYjI4MWIyNDcyZjRkZjQwM2E0NDE5ODI3NDM5ZmYyYjpmODBmYmVmNzA2Nzg2NjI4MDY3NTlhOTcyNTBhY2VjMTMxOTFhZGI5Y2Q5NzIxOGY1YjBmYTY0ZDUwYjBlOWVk"
          }
        }
      );
      const plans = await response.json();
      plans.data.forEach(async plan => {
        var today = new Date("November 17, 2019");
        if (today - new Date(plan.attributes.dates) == 0) {
          this.plan = plan;
          var timer = setInterval(callTime, 5000);
          var me = this;
          function callTime() {
            me.getCurrentItemTime();
          }
        }
      });
    },
    async getCurrentItemTime() {
      await this.plan;
      if (this.plan != null) {
        const response = await fetch(
          "https://api.planningcenteronline.com/services/v2/service_types/227874/plans/" +
            this.plan.id +
            "/live/current_item_time",
          {
            headers: {
              Authorization:
                "Basic MzRmMzY5OWNkMmFkZjc3YmFmOTNlMDJlZjUyYjU3YTYxYjI4MWIyNDcyZjRkZjQwM2E0NDE5ODI3NDM5ZmYyYjpmODBmYmVmNzA2Nzg2NjI4MDY3NTlhOTcyNTBhY2VjMTMxOTFhZGI5Y2Q5NzIxOGY1YjBmYTY0ZDUwYjBlOWVk"
            }
          }
        );
        var currentItemTime = await response.json();
        this.startTime = new Date(
          currentItemTime.data.attributes.live_start_at
        );
        var currentItem = currentItemTime.data.relationships.item;
        this.getItem(currentItem.data.id);
      }
    },
    async getItem(itemId) {
      const response = await fetch(
        "https://api.planningcenteronline.com/services/v2/service_types/227874/plans/" +
          this.plan.id +
          "/items/" +
          itemId,
        {
          headers: {
            Authorization:
              "Basic MzRmMzY5OWNkMmFkZjc3YmFmOTNlMDJlZjUyYjU3YTYxYjI4MWIyNDcyZjRkZjQwM2E0NDE5ODI3NDM5ZmYyYjpmODBmYmVmNzA2Nzg2NjI4MDY3NTlhOTcyNTBhY2VjMTMxOTFhZGI5Y2Q5NzIxOGY1YjBmYTY0ZDUwYjBlOWVk"
          }
        }
      );
      var item = await response.json();
      this.itemName = item.data.attributes.title;
      this.itemLength = item.data.attributes.length;
    }
  }
};
</script>
<style>
html,
body {
  height: 100%;
  margin: 0px;
  overflow: hidden;
}
.content {
  font-size: 40vw;
  margin: 0px;
  display: flex;
  background-color: black;
  padding-top: 90px;
}
.white {
  color: white;
}
.red {
  color: red;
}
.minus,
.minutes,
.colon,
.seconds {
  font-family: "Helvetica Neue";
  font-weight: 300;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 400px;
  margin-top: -3vh !important;
}
.name {
  font-family: "Helvetica Neue";
  font-weight: 300;
  height: 30px;
  width: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: -10px;
  color: white;
  font-size: 3vw;
}
@media only screen and (max-width: 600px) {
  .name {
    margin-top: 100px;
    font-size: 10vw;
  }
  .content {
    padding-top: 250px;
  }
}
</style>
