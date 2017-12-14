console.log('ENV')
console.log(process.env)
console.log(process.env.SOCIOCORTEX_URL)


module.exports = {
    sc : {
        url: process.env.SOCIOCORTEX_URL || 'SocioCortex URL not set!',
        pass: 'ottto',
        user: 'mustermann@test.sc'
    }
 };