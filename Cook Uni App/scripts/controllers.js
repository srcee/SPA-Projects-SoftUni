import { getSessionInfo, getMemberInfo, createLoadPartials, setAuthInfo } from "./helpers.js";
import { post, get, put, del } from "./requester.js";

const partials = {
    header: './templates/common/header.hbs',
    footer: './templates/common/footer.hbs'
};
const categoryImages = {
    'Fruits': 'https://t3.ftcdn.net/jpg/00/87/05/06/240_F_87050645_NGkJwdXlikO6DWOppUu93fQwLYeBdDEq.jpg',
    'Vegetables and legumes/beans': 'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg',
    'Milk, cheese, eggs and alternatives': 'https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg',
    'Lean meats and poultry, fish and alternatives': 'https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg',
    'Grain Food': 'https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg',
};

// home & about page
export function loadHome(ctx) {
    getSessionInfo(ctx);
    if (ctx.loggedIn) {
        get('appdata', 'cookUniApp', 'Kinvey')
            .then(data => {
                ctx.recipes = data;
                createLoadPartials.call(this, partials, 'home/home.hbs');
            })
    } else {
        createLoadPartials.call(this, partials, 'home/home.hbs');
    }
};

// login & logout
export function getLogin(ctx) {
    getSessionInfo(ctx);
    createLoadPartials.call(this, partials, 'user/login.hbs');
};
export function postLogin(ctx) {
    const { username, password } = ctx.params;
    try {
        post('user', 'login', { username, password }, 'Basic')
            .then(userInfo => {
                setAuthInfo(userInfo);
                ctx.redirect('/');
            })
            .catch(console.error)
    } catch (err) {
        console.log(err)
    }
};
export function getLogout(ctx) {
    try {
        post('user', '_logout', {}, 'Kinvey')
            .then(() => {
                sessionStorage.clear();
                ctx.redirect('/')
            })
    } catch (err) {
        console.log(err)
    }
};

// register
export function getRegister(ctx) {
    createLoadPartials.call(this, partials, 'user/register.hbs');
};
export function postRegister(ctx) {
    const { username, password, repeatPassword, firstName, lastName } = ctx.params;
    if (username && firstName && lastName && password === repeatPassword) {
        try {
            post('user', '', { username, password, firstName, lastName }, 'Basic')
                .then((userInfo) => {
                    setAuthInfo(userInfo);
                    ctx.redirect('/')
                })
        } catch (err) {
            alert(err)
        }
    } else {
        alert('Passwords does not match.')
    }
};
// recipe details
export function getDetails(ctx) {
    const id = ctx.params.foodId;
    get('appdata', `cookUniApp/${id}`, 'Kinvey')
        .then((data) => {
            getSessionInfo(ctx);
            ctx.recipe = data;
            ctx.isAuthor = sessionStorage.getItem('userId') === data._acl.creator
            createLoadPartials.call(this, partials, 'recipeDetails/details.hbs');
        })
        .catch(console.error)
};
// share recipe
export function getShare(ctx) {
    getSessionInfo(ctx);

    createLoadPartials.call(this, partials, 'operations/share.hbs');
};
export function postShare(ctx) {
    const { category, description, foodImageURL, ingredients, meal, prepMethod } = ctx.params;
    if (category && description && foodImageURL && ingredients && meal && prepMethod) {
        try {
            post('appdata', 'cookUniApp', {
                category,
                description,
                foodImageURL,
                ingredients: ingredients.split(' '),
                meal,
                prepMethod,
                likesCounter: 0,
                categoryImageURL: categoryImages[category]
            })
                .then(() => {
                    ctx.redirect('/');
                })
        } catch (err) {
            console.log(err);
        }
    }
};
// edit, like, delete recipe\
export function getEdit(ctx) {
    const id = ctx.params.foodId;
    try {
        get('appdata', `cookUniApp/${id}`, 'Kinvey')
            .then(data => {
                getSessionInfo(ctx)
                ctx.recipe = data;
                ctx.recipe.ingredients = ctx.recipe.ingredients.join(' ');
                createLoadPartials.call(this, partials, 'operations/edit.hbs');
            })
    } catch (err) {
        console.log(err)
    }
};
export function postEdit(ctx) {
    const { category, description, foodId, foodImageURL, ingredients, meal, prepMethod } = ctx.params;
    try {
        put('appdata', `cookUniApp/${foodId}`, {
            ingredients: ingredients.split(' '),
            categoryImageURL: categoryImages[category],
            category,
            description,
            foodImageURL,
            meal,
            prepMethod,
            likesCounter
        })
            .then(() => ctx.redirect(`details/${foodId}`))
    } catch (err) {
        console.log(err)
    }
};
export function postDelete(ctx) {
    try {
        getSessionInfo(ctx)
        const id = ctx.params.foodId;
        del('appdata', `cookUniApp/${id}`)
            .then(() => ctx.redirect('/'));
    } catch (err) {
        console.log(err);
    }
};
export function putLike(ctx) {
    const { foodId } = ctx.params;
    try {
        get('appdata', `cookUniApp/${foodId}`)
            .then((data) => {
                ctx.recipe = data;
                const { category, description, foodImageURL, ingredients, meal, prepMethod, likesCounter, categoryImageURL } = ctx.recipe;
                put('appdata', `cookUniApp/${foodId}`, {
                    likesCounter: likesCounter + 1,
                    categoryImageURL,
                    ingredients,
                    category,
                    description,
                    foodImageURL,
                    meal,
                    prepMethod
                }, 'Kinvey')
                    .then(() => ctx.redirect(`details/${foodId}`))
            })
    } catch (err) {
        console.log(err)
    }
}

