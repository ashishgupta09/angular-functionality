import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalStorage } from '../../services/local-storage';

@Component({
  selector: 'app-promise',
  imports: [CommonModule],
  templateUrl: './promise.html',
  styleUrl: './promise.scss',
})
export class Promise implements OnInit {

  constructor(
    private fileService: LocalStorage
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getUsers();
    this.getFileData();
    this.fetchCurrentWeatherAPi();
  }

  getData() {
    fetch("https://jsonplaceholder.typicode.com/users").then((res => res.json()))
      .then((data) => console.log(data)).catch(error => {
        console.log("Error:", error);
      });;
  }

  async getUsers() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await response.json();
      console.log("Users:", data);
    } catch (error) {
      console.log("Error:", error);
    }
  }

  getFileData() {
    this.fileService.downloadFile()
      .then(res => console.log(res))
      .catch(erorr => console.log(erorr))
  }

  fetchCurrentWeatherAPi() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.85&current_weather=true")
      .then(response => response.json())
      .then(data => {
        console.log("Temperature:", data.current_weather.temperature);
      })
      .catch(err => console.log("Error:", err));
  }

  async loginUser() {
    try {
      const response = await fetch("https://reqres.in/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "eve.holt@reqres.in",
          password: "cityslicka"
        })
      });

      const data = await response.json();

      console.log("Token:", data.token);
    } catch (error) {
      console.log("Login failed:", error);
    }
  }

}
