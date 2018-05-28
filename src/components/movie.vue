<template>
  <div class="movie">
    <nav class="navbar is-transparent" role="navigation" aria-label="dropdown navigation">
      <a class="navbar-item">
        <img src="https://static1.squarespace.com/static/55426501e4b067d5d2c4b56a/t/58fd6214a5790ac52b7e4272/1493000776244/?format=500w" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">
      </a>
      <a class="navbar-item" @click="clear()">
        Home
      </a>
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Admin
          </a>
          <div class="navbar-dropdown is-boxed">
            <a class="navbar-item" @click="clickAd()">
              movie
            </a>
          </div>
        </div>
      </div>
    </nav>
    <section class="hero" v-if="!flag">
      <div class="hero-body">
        <div class="container">
          <br><br><br>
          <h1 class="title has-text-white">
            Popular
          </h1>
          <img :src="movie.img" v-for="movie in movies" :key="movie['.key']" class="poster" @click="selectMovie(movie, movie['.key'])">
        </div>
      </div>
    </section>
    <section class="hero" v-else>
      <div class="bg" v-bind:style="{ 'background-image': 'url(' + movie.img + ')' }"></div>
      <div class="hero-body conten">
        <div class="columns">
          <div class="column">
            <br>
            <h1 class="title has-text-white">
              {{movie.name}}
              <span class="tag is-primary is-light">
                {{movie.language}}
              </span>
            </h1>
          </div>
        </div>
        <div class="columns">
          <div class="column is-two-fifths has-text-centered">
            <img :src="movie.img" class="post">
            <p class="has-text-white">
              <strong class="has-text-white">name :</strong> {{movie.name}}<br>
              <strong class="has-text-white">genre :</strong> <span v-for="genre in movie.genre" :key="genre['.key']">{{genre}} </span><br>
              <strong class="has-text-white">price :</strong> {{movie.price}} บาท
            </p>
            <p class="has-text-light">{{ movie.short }}</p>
          </div>
          <div class="column">
            <iframe width="560" height="315" v-if="movie.video" :src="youtubeUrl()" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            <br>
            <div v-if="!flagBook">
            <a class="button is-info is-medium time" @click="clickTime(key)" v-for="(time, key) in movie.times" :key="time['.key']">
              {{ timeStr(key) }}
            </a>
            </div>
            <div v-else>
              <table class="table">
                <thead class="thead">
                  <tr class="tr"><td colspan="11" class="th has-text-centered">Screen</td>
                  </tr>
                  <tr class="tr"><td></td><td v-for="(i, index) in 10" :key="i['.key']" class="th has-text-centered">{{index + 1}}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr class="tr" v-for="(i, index) in alphabets" :key="i['.key']">
                    <td class="th">{{i}}</td>
                    <td class="td has-text-centered" v-for="j in 10" :key="j['.key']">
                      <b-checkbox v-model="movie.seats[selTime][index][j - 1]"
                          native-value="true"
                          :disabled="seats[index][j - 1]">
                      </b-checkbox>
                    </td>
                  </tr>
                </tbody>
              </table>
              <a class="button is-info is-large" v-if="checkseat() !== ''" @click="buySeat(selId)">
              Confirm
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="modal is-active" v-if="flagAd">
      <div class="modal-card">
        <header class="modal-card-head">
          <div class="tabs is-toggle is-centered">
            <ul>
              <li :class="(flagAdd)?'is-active':''">
                <a @click="addMovieBtn()">
                  <span class="icon is-small"><i class="fas fa-plus-circle" aria-hidden="true"></i></span>
                  <span>Add</span>
                </a>
              </li>
              <li :class="(flagEdit)?'is-active':''">
                <a @click="editMovieBtn()">
                  <span class="icon is-small"><i class="fas fa-edit" aria-hidden="true"></i></span>
                  <span>Edit</span>
                </a>
              </li>
            </ul>
          </div>
        </header>
        <section class="modal-card-body">
          <p class="modal-card-title" v-if="flagAdd">Add movie</p>
          <p class="modal-card-title" v-else>Edit movie</p>
          <br>
          <b-field label="Select movie*" v-if="flagEdit">
            <b-select placeholder="Select a name" v-model="movie">
                <option
                    v-for="movie in movies"
                    :key="movie['.key']"
                    :value="movie">
                    {{ movie.name }} @{{movie['.key']}}
                </option>
            </b-select>
          </b-field>
          <div v-if="flagAdd||(flagEdit&&movie.name!=='')">
          <b-field label="Name*">
            <b-input v-model="movie.name" required></b-input>
          </b-field>
          <img :src="movie.img">
          <b-field label="Img URL*">
            <b-input placeholder="Img" type="url" v-model="movie.img" required></b-input>
          </b-field>
          <iframe width="560" height="315" v-if="movie.video" :src="youtubeUrl()" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          <b-field label="Youtube URL*">
            <b-input placeholder="Video" type="url" v-model="movie.video" required></b-input>
          </b-field>
          <b-field label="Price*">
            <b-input placeholder="90 บาท" type="number" v-model="movie.price" required></b-input>
          </b-field>
          <b-field label="language*">
            <b-select placeholder="Select a language" v-model="movie.language" required>
              <option value="TH">
                TH
              </option>
              <option value="EN">
                EN
              </option>
            </b-select>
          </b-field>

          <b-field label="Showtime*">
            <b-timepicker
              v-model="time"
              placeholder="time"
              :min-time="minTime"
              :max-time="maxTime">
            </b-timepicker>
          </b-field>
            <span class="icon is-small" @click="addTime()" v-show="time">
              <i class="fas fa-plus-circle" aria-hidden="true"></i>
            </span>
            <span class="tag is-success is-medium" v-for="(time, key) in movie.times" :key="time['.key']">
              {{ timeStr(key) }}
              <button class="delete is-small" @click="deleteTime(key)"></button>
            </span>
          <br>
          <b-field label="genre">
            <div class="block">
              <b-checkbox v-model="movie.genre"
                  native-value="Action">
                  Action
              </b-checkbox>
              <b-checkbox v-model="movie.genre"
                  native-value="Adventure">
                  Adventure
              </b-checkbox>
              <b-checkbox v-model="movie.genre"
                  native-value="Comedy">
                  Comedy
              </b-checkbox>
              <b-checkbox v-model="movie.genre"
                  native-value="Drama">
                  Drama
              </b-checkbox>
              <b-checkbox v-model="movie.genre"
                  native-value="Fantasy">
                  Fantasy
              </b-checkbox>
              <b-checkbox v-model="movie.genre"
                  native-value="Horror">
                  Horror
              </b-checkbox>
              <b-checkbox v-model="movie.genre"
                  native-value="Animation">
                  Animation
              </b-checkbox>
              <b-checkbox v-model="movie.genre"
                  native-value="Crime">
                  Crime
              </b-checkbox>
              <b-checkbox v-model="movie.genre"
                  native-value="Romance">
                  Romance
              </b-checkbox>
              <b-checkbox v-model="movie.genre"
                  native-value="Thriller">
                  Thriller
              </b-checkbox>
            </div>
          </b-field>
          <b-field label="Short story">
              <b-input maxlength="500" type="textarea" v-model="movie.short"></b-input>
          </b-field>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="saveMovie()" v-if="flagAdd" :disabled="!(movie.language && movie.img && movie.name && movie.video && movie.price)">Add</button>
          <button class="button is-success" @click="editMovie(movie['.key'])" v-if="flagEdit&&movie.name!==''" :disabled="!(movie.language && movie.img && movie.name && movie.video && movie.price)">Save</button>
          <button class="button is-danger" @click="deleteMovie(movie['.key'])" v-if="flagEdit&&movie.name!==''">Delete</button>
          <button class="button" @click="clear()">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import swal from 'sweetalert2'
let config = {
  apiKey: 'AIzaSyBw7IdjPHuGSI9ZQFdIB2y5HXwiv7ki7yw',
  authDomain: 'movie-4a35a.firebaseapp.com',
  databaseURL: 'https://movie-4a35a.firebaseio.com',
  projectId: 'movie-4a35a',
  storageBucket: 'movie-4a35a.appspot.com',
  messagingSenderId: '434348701695'
}
var firebaseApp = firebase.initializeApp(config)
var db = firebaseApp.database()
var moviesRef = db.ref('movies')
export default {
  name: 'movie',
  data () {
    const min = new Date()
    min.setHours(10)
    min.setMinutes(0)
    const max = new Date()
    max.setHours(23)
    max.setMinutes(30)
    return {
      minTime: min,
      maxTime: max,
      flag: false,
      flagAd: false,
      flagAdd: true,
      flagEdit: false,
      flagBook: false,
      movie: {},
      time: null,
      seats: [
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false]
      ],
      selTime: 0,
      selId: '',
      alphabets: ['J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'],
      movieO: {
        language: 'TH',
        genre: [],
        img: '',
        name: '',
        video: '',
        price: null,
        short: '',
        times: [],
        seats: []
      }
    }
  },
  methods: {
    selectMovie (obj, key) {
      this.selId = key
      this.movie = obj
      this.flag = true
      this.flagBook = false
    },
    clear () {
      this.seats = [
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false, false]
      ]
      this.movie = {}
      this.flag = false
      this.flagAd = false
      this.flagBook = false
      this.selTime = 0
      this.selId = ''
      this.time = null
    },
    clickAd () {
      this.movie = this.movieO
      this.flagAd = true
      this.flag = false
      this.flagBook = false
    },
    addMovieBtn () {
      this.flagAdd = true
      this.flagEdit = false
      this.movie = this.movieO
    },
    editMovieBtn () {
      this.flagEdit = true
      this.flagAdd = false
      this.movie = this.movieO
    },
    saveMovie () {
      this.pushSeatsAr()
      moviesRef.push(this.movie)
      let tmp = this.movie.name
      this.clear()
      swal({
        title: 'Success',
        text: 'Add movie \n' + tmp + '\n Success',
        type: 'success',
        confirmButtonText: 'OK'
      })
    },
    pushSeatsAr () {
      for (var i = 0, len = this.movie.times.length; i < len; i++) {
        this.movie.seats.push(this.seats)
      }
    },
    editMovie (key) {
      let tmp = {
        language: this.movie.language,
        genre: this.movie.genre,
        img: this.movie.img,
        name: this.movie.name,
        video: this.movie.video,
        price: this.movie.price,
        short: this.movie.short,
        times: this.movie.times,
        seats: this.movie.seats
      }
      this.pushSeatsAr()
      moviesRef.child(key).set(tmp)
      this.clear()
      swal({
        title: 'Success',
        text: 'Edit movie ' + tmp.name + ' Success',
        type: 'success',
        confirmButtonText: 'OK'
      })
    },
    buySeat (key) {
      var str = this.checkseat()
      if (str !== '') {
        moviesRef.child(key + '/seats').set(this.movie.seats)
      }
      this.clear()
      swal({
        title: 'Success',
        text: 'Buy seats ' + str + ' Success',
        type: 'success',
        confirmButtonText: 'OK'
      })
    },
    deleteMovie (key) {
      moviesRef.child(key).set(null)
      this.clear()
      swal({
        title: 'Success',
        text: 'Delete movie Success',
        type: 'success',
        confirmButtonText: 'OK'
      })
    },
    youtubeUrl () {
      var str = 'https://www.youtube.com/embed/' + this.movie.video.substr(17, 11) + '?rel=0&amp;showinfo=0'
      return str
    },
    addTime () {
      var index = -1
      for (var i = 0; i < this.movie.times.length; i++) {
        if (this.movie.times[i] === this.time) {
          index = i
        }
      }
      if (index !== -1) {
        this.movie.times[index].amount++
      } else {
        this.movie.times.push(this.time + '')
        this.time = null
      }
    },
    deleteTime (key) {
      this.movie.times.splice(key, 1)
    },
    timeStr (key) {
      let time = this.movie.times[key]
      let tmp = new Date()
      if (typeof time === 'string' || time instanceof String) {
        tmp = new Date(time)
      }
      return tmp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    },
    clickTime (key) {
      this.flagBook = true
      this.selTime = key
      for (var i = 0, len = this.movie.seats[key].length; i < len; i++) {
        for (var j = 0, lenj = this.movie.seats[key][i].length; j < lenj; j++) {
          this.seats[i] = this.movie.seats[key][i].slice()
        }
      }
    },
    checkseat () {
      var str = ''
      for (var i = 0, len = this.movie.seats[this.selTime].length; i < len; i++) {
        for (var j = 0, lenj = this.movie.seats[this.selTime][i].length; j < lenj; j++) {
          if (this.movie.seats[this.selTime][i][j] !== this.seats[i][j]) {
            str += this.alphabets[i] + (j + 1) + '  '
          }
        }
      }
      return str
    }
  },
  computed: {
  },
  firebase: {
    movies: moviesRef
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 0px;
}
a {
  color: #42b983;
}
.poster {
  width: 15rem;
  margin: 5px;
}
.post {
  width: 20rem;
}
img.poster {
  opacity: 1;
  transition: opacity 0.5s;
}
.tag {
  margin-right: 5px;
}
img.poster:hover {
  opacity: 0.25;
}
.button.time {
  margin-right: 5px;
}
.td {
  padding:5px;
}
.bg {
    position: fixed;
  left: 0;
  right: 0;
  z-index: 1;

  display: block;
  /*background-image: url('http://666a658c624a3c03a6b2-25cda059d975d2f318c03e90bcf17c40.r92.cf1.rackcdn.com/unsplash_527bf56961712_1.JPG');*/
  background-size:cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  opacity: 0.3;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -o-filter: blur(5px);
  -ms-filter: blur(5px);
  filter: blur(5px);
}
.conten{
    position: fixed;
  left: 0;
  right: 0;
  z-index: 9999;
  margin-left: 20px;
  margin-right: 20px;
}
</style>
