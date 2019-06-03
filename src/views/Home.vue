<template>
<div class="content" :class="(minusTime)?'red':'white'">
  <p class="minus" v-if="minusTime">-</p>
  <p class="minutes">{{minutesLeft}}</p>
  <p class="colon"> : </p>
  <p class="seconds">{{secondsLeft}}</p>
</div>
</template>
<script>
export default {
  data() {
    return {
      minusTime: false,
      itemLength: null,
      timeNow: null,
      startTime: 0
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      window.setInterval(() => {
        this.timeNow = new Date().setTime(new Date().getTime() - 75270000);
        // this.getTimeNow();
      }, 1000);
    });
  },
  computed: {
    timeLeft: function() {
      // console.log(this.getTimeNow())
      if (this.itemLength !== null) {
        return this.itemLength + (this.startTime - this.timeNow) / 1000;
      }
    },
    minutesLeft: function() {
      //  return 0
      if (this.timeLeft > 60 || this.timeLeft <60) {
        var timeLeftMinutes = Math.floor(this.timeLeft / 60);
        return Math.abs(timeLeftMinutes);
      }
      return 0;
    },
    secondsLeft: function() {
      // return 0
      if (this.timeLeft !== undefined) {
        if (this.timeLeft > 60 || this.timeLeft <60) {
          var timeLeftSeconds = Math.floor(this.timeLeft % 60);
          if(timeLeftSeconds < 0){
          this.minusTime = true
        } else {
          this.minusTime = false
        }
          if(Math.floor(Math.abs(timeLeftSeconds)) < 10){
            return "0"+Math.floor(Math.abs(timeLeftSeconds))
          }
          return Math.floor(Math.abs(timeLeftSeconds));
        }
        if(this.timeLeft < 0){
          this.minusTime = true
        } else {
          this.minusTime = false
        }
        if(Math.floor(Math.abs(this.timeLeft)) < 10){
          return "0"+Math.floor(Math.abs(this.timeLeft))
        }
        return Math.floor(Math.abs(this.timeLeft));
      }
      return 0;
    }
  },

  created() {
    this.getAllPlans();
  },
  methods: {
    async getAllPlans() {
      const response = await fetch(
        "https://api.planningcenteronline.com/services/v2/service_types/227874/plans?order=-sort_date",
        {
          headers: {
            Authorization:
              "Basic MzRmMzY5OWNkMmFkZjc3YmFmOTNlMDJlZjUyYjU3YTYxYjI4MWIyNDcyZjRkZjQwM2E0NDE5ODI3NDM5ZmYyYjpmODBmYmVmNzA2Nzg2NjI4MDY3NTlhOTcyNTBhY2VjMTMxOTFhZGI5Y2Q5NzIxOGY1YjBmYTY0ZDUwYjBlOWVk"
            // 'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
      const plans = await response.json();
      plans.data.forEach(async plan => {
        var today = new Date("June 02, 2019");
        if (today - new Date(plan.attributes.dates) == 0) {
          var responseItems = await fetch(
            "https://api.planningcenteronline.com/services/v2/service_types/227874/plans/" +
              plan.id +
              // "40147061" +
              "/items",
            {
              headers: {
                Authorization:
                  "Basic MzRmMzY5OWNkMmFkZjc3YmFmOTNlMDJlZjUyYjU3YTYxYjI4MWIyNDcyZjRkZjQwM2E0NDE5ODI3NDM5ZmYyYjpmODBmYmVmNzA2Nzg2NjI4MDY3NTlhOTcyNTBhY2VjMTMxOTFhZGI5Y2Q5NzIxOGY1YjBmYTY0ZDUwYjBlOWVk"
                // 'Content-Type': 'application/x-www-form-urlencoded',
              }
            }
          );
          var items = await responseItems.json();
          items.data.forEach(async item => {
            var responseItemTime = await fetch(
              "https://api.planningcenteronline.com/services/v2/service_types/227874/plans/" +
                plan.id +
                // "40147061" +
                "/items/" +
                item.id +
                "/item_times",
              {
                headers: {
                  Authorization:
                    "Basic MzRmMzY5OWNkMmFkZjc3YmFmOTNlMDJlZjUyYjU3YTYxYjI4MWIyNDcyZjRkZjQwM2E0NDE5ODI3NDM5ZmYyYjpmODBmYmVmNzA2Nzg2NjI4MDY3NTlhOTcyNTBhY2VjMTMxOTFhZGI5Y2Q5NzIxOGY1YjBmYTY0ZDUwYjBlOWVk"
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                }
              }
            );
            var itemTimes = await responseItemTime.json();
            if (itemTimes.data.length > 0) {
              if (
                itemTimes.data[0].attributes.live_start_at !== null &&
                itemTimes.data[0].attributes.live_end_at == null
              ) {
                var responseItem = await fetch(
                  "https://api.planningcenteronline.com/services/v2/service_types/227874/plans/" +
                    plan.id +
                    // "40147061" +
                    "/items/" +
                    item.id,
                  {
                    headers: {
                      Authorization:
                        "Basic MzRmMzY5OWNkMmFkZjc3YmFmOTNlMDJlZjUyYjU3YTYxYjI4MWIyNDcyZjRkZjQwM2E0NDE5ODI3NDM5ZmYyYjpmODBmYmVmNzA2Nzg2NjI4MDY3NTlhOTcyNTBhY2VjMTMxOTFhZGI5Y2Q5NzIxOGY1YjBmYTY0ZDUwYjBlOWVk"
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    }
                  }
                );
                var item = await responseItem.json();
                //NAME
                console.log(item.data.attributes.title);
                this.itemLength = item.data.attributes.length;
                //Länge
                console.log(this.itemLength);
                this.startTime = new Date(
                  itemTimes.data[0].attributes.live_start_at
                );
                //Startzeit
                console.log(itemTimes.data[0].attributes.live_start_at == null);
                console.log(this.startTime);
              }
            }
          });
        }
      });
    }
  }
};
</script>
<style>
 html, body {
        height: 100%;
        margin: 0px;
    }
.content{
  height: 100%;
  font-size: 40vw;
  margin: 0px;
  display: flex;
  background-color: black
}
.white{
  color: white;
}
.red{
  color: red;
}
.minus, .minutes, .colon, .seconds{
  margin-top: -150px !important;
}
</style>
