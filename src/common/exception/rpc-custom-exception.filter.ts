
import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {

    catch(exception: RpcException, host: ArgumentsHost) {

        const ctx = host.switchToHttp()
        const response = ctx.getResponse()

        const rpcError = exception.getError()
        
        //? Notificacion cuando un microservicio se cae o no funciona
        if(rpcError.toString().includes('Empty response')){
            return response.status(500).json({
                status: 500,
                message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') -1)
            })
        }
        
        if(typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError){
            
            const status = rpcError.status
            return response.status(status).json({
                status: rpcError.status,
                message: rpcError.message
            })
        }

        response.status(400).json({
            status: 400,
            message: rpcError
        })

    }

}
