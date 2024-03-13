import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  providers: [HttpClient]
})
export class PostComponent {
  
  http = inject(HttpClient);
  posts: any[] = [];

  url: string = 'https://api.hatchways.io/assessment/blog/posts?tag=tech';

  errorMsg: string = '';

  arrayFields: string[] = ["likes","reads","popularity","id"];

  currFieldVal: string = '';

  ngOnInit(): void{
    this.fetchPosts(this.url);
  }

  fetchPosts(url: string){
    this.errorMsg = '';
    this.http.get(url).subscribe((response:any)=>{
      console.log(response);
      //this.posts = response;
      this.posts = Array.isArray(response) ? response : (response.posts || []);
      //this.posts = this.removeDuplicates(this.posts,"author");
    });
  }

  searchTag(tagVar: any)
  {
    this.errorMsg = '';

    if (tagVar.value.length < 1){
      this.errorMsg = "tags parameter is required";
      this.posts = [];
    }
    else{
      this.url = "https://api.hatchways.io/assessment/blog/posts?tag=" + tagVar.value.toLowerCase();
      this.fetchPosts(this.url);
    }
  }

  sortBy(field: any)
  {
    this.errorMsg = '';

    this.currFieldVal = field.value;

    if (!this.arrayFields.includes(field.value.toLowerCase()))
    {
      this.errorMsg = "sortBy parameter is invalid";
      this.posts = [];
    }
    else{
      this.posts = this.posts.sort((a:any,b:any)=>a[field.value]-b[field.value]);
    }
  }

  directionSort(dir: any)
  {
    this.errorMsg = '';

    if (dir.value.toLowerCase() == "asc")
    {
      this.posts = this.posts.sort((a:any,b:any)=>a[this.currFieldVal]-b[this.currFieldVal]);
    }
    else if (dir.value.toLowerCase() == "desc")
    {
      this.posts = this.posts.sort((a:any,b:any)=>b[this.currFieldVal]-a[this.currFieldVal]);
    }
    else{
      this.errorMsg = "direction parameter is invalid";
      this.posts = [];
    }
  }

  removeDuplicates(array:any[], field:any) {
    return array.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[field]).indexOf(obj[field]) === pos;
    });
  }
}
