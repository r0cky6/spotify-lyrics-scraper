
class AuthHandler {
    static parseURL(){
        let params = new URLSearchParams(window.location.search)
        params.get('code')
        
    }
    static getCode(){
        
    }
}
export default AuthHandler