import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
import { ProductDetailComponent } from 'src/app/admin/product-detail/product-detail.component';
import { ApiService } from 'src/app/services/api.service';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  title:any;
  books:any={};
  userData:any = {};
  constructor(
    public dialog:MatDialog,
    public api:ApiService,
    public db :AngularFirestore,
    public auth:AngularFireAuth
  ) {

   }

  ngOnInit(): void {
    this.title='Product';
    this.auth.user.subscribe(user=>{
      this.userData = user;
      this.getBooks();
    })
  }

  loading:boolean | undefined;
  getBooks()
  {
    this.loading=true;
    this.db.collection('books',ref=>{
      return ref.where('uid','==',this.userData.uid);
    }).valueChanges({idField : 'id'}).subscribe(result=>{
      console.log(result);
      this.books=result;
      this.loading=false;
    },error=>{
      this.loading=false;
    }) 
  }


    ProductDetail(data: any,idx: number)
    {
      let dialog= this.dialog.open(ProductDetailComponent, {
          width: '400px',
          data: data,
      });
        dialog.afterClosed().subscribe(result=> {
        return;
        });
      }


      loadingDelete:any={};
      DeleteProduct(id: any,idx: any)
      {
        var conf=confirm('Delete item?');
        if(conf)
        {
          this.db.collection('books').doc(id).delete().then(result=>{
            this.books.splice(idx,1);
            this.loadingDelete[idx]=false;
          }).catch(error=>{
            this.loadingDelete[idx]=false;
            alert('Tidak dapat menghapus data');
          });
        }
      }


      Uploadfile(data: any)
      {
        let dialog= this.dialog.open(FileUploaderComponent  , {
          width: '500px',
          data: data
      });
        dialog.afterClosed().subscribe(result=> {
        return;
        })      
      }

      downloadFile(data:any)
      {
        FileSaver.saveAs('http://api.sunhouse.co.id/bookstore/'+data.url);
        //FileSaver.saveAs('');
      }
    }