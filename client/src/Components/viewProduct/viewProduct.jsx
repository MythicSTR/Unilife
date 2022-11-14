import React, { Component } from "react";
import jwt_decode from 'jwt-decode';
import './viewProduct.css';

const token = jwt_decode(localStorage.getItem('jwtToken'));
let userRating=0;


class viewProduct extends Component{
    state = {
        card : JSON.parse(sessionStorage.getItem('selectedProduct')),
        rating : 0,
        hover : 0
    }

    //loads user rating for the given product
    UserRating = async() =>{
      userRating = await fetch('http://localhost:5000/api/users/userrating',{
          method : "POST",
      headers:{
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          id : token.id,
          itemId : this.state.card._id,
        }),
      })
      .then(res=> {
          if(res.ok) return res.json()
          return res.json().then(json=>Promise.reject(json))
        })
        .then((data)=>{
          return data.rating;
        })
        .catch(e=>{
          console.error(e.error)
        })
      console.log(userRating);
  }

  //saves user rating for the given item
  saveUserRating = async(value) =>{
      await fetch('http://localhost:5000/api/users/saveuserrating',{
          method : "POST",
      headers:{
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          id : token.id,
          itemId : this.state.card._id,
          rating:value
        }),
      })
      .then(res=> {
          if(res.ok) return res.json()
          return res.json().then(json=>Promise.reject(json))
        })
        .then((data)=>{
          return data;
        })
        .catch(e=>{
          console.error(e.error)
        })
  }

  //updates rating of the product
  udpateRating = async(value) =>{
      await fetch('http://localhost:5000/api/users/updaterating',{
          method : "POST",
      headers:{
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          itemId : this.state.card._id,
          rating:value,
          productby:this.state.card.productby
        }),
      })
      .then(res=> {
          if(res.ok) return res.json()
          return res.json().then(json=>Promise.reject(json))
        })
        .then((data)=>{
          return data;
        })
        .catch(e=>{
          console.error(e.error)
        })
  }

    cartclicked = async (itemid) => {
        const token = jwt_decode(localStorage.getItem('jwtToken'));
        const response = await fetch('http://localhost:5000/api/users/add-to-cart',{
          method : "POST",
          headers:{
              "Content-Type" : "application/json"
            },
            body : JSON.stringify({
              itemId : itemid,
              quantity : 1,
              id : token.id,
            }),
      })
        .then(res=> {
              if(res.ok) return res.json()
              return res.json().then(json=>Promise.reject(json))
            })
            .then((data)=>{
              return data;
            })
            .catch(e=>{
              console.error(e.error)
            })
      console.log(response);
      if(response===true){
        window.alert("Item added to Cart");
      }
      else{
        window.alert("Error 402 : Can not add item to card");
      }
    }

    render(){
      const {rating,hover} = this.state;
        return(
            // <div>
            //     <h1>See Your Product </h1>
            //     <h2>{this.state.card.title}</h2>
            //     <img src={this.state.card.imagepath}
            //     alt={this.state.card.title}
            //     className = "img-fluid img-thumbnail rounded indvCard bg-dark"
            //     />
            //     <div class="cart-div">
            //         <FaCartArrowDown class="cart-icon" onClick={()=>{
            //             this.cartclicked(this.state.card._id)
            //         }
            //         }/>
            //     </div>
            // </div>
			<div className=''>
				<div className='header'>
					<h1>Product details</h1>
				</div>
				<div className='main-section'>
					<div classname='product-image'>
						<img
							src={this.state.card.imagepath}
							alt={this.state.card.title}
							className='thumbnail'
						/>
					</div>
					<div className='product-details'>
						<h3>{this.state.card.title}</h3>
						<div className='price-rate'>
							Rs. {this.state.card.price}
						</div>
						<div className="star-rating">
						  {[...Array(5)].map((star, index) => {
							index +=1;
							return (
							  <button
								type="rating_button"
								key={index}
								className={index <= (hover || rating) ? "star-button on" : "star-button off"}
								onClick={() => {
								  this.setState({rating:index});
								  this.saveUserRating(index);
								  this.udpateRating(index);
							  }}
								onMouseEnter={() => this.setState({hover:index})}
								onMouseLeave={() => this.setState({hover:rating})}
							  >
								<span className="star">&#9733;</span>
							  </button>
							);
						  })}
						</div>
						<div className='description'>
							{this.state.card.description}
						</div>
						<div className='button-options'>
							<button
								className = 'buy-now'
							>
								Buy Now	
							</button>
							<button
								className = 'add-to-cart'
								// onClick = {() => this.cartclicked(this.state.card._id)}
							>
								Add to Cart	
							</button>
						</div>


					</div>
				</div>
			</div>
        )
    }
}

export default viewProduct;
