import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
// import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

// <RpcException>
// Observable<any>
@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): any {
    console.log('Paso por nuestro fILTER');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError = exception.getError();
    if (rpcError.toString().includes('Empty response')) {
      response.status(500).json({
        status: 500,
        message: 'Empty response',
      });
      return;
    }
    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const { message } = rpcError;
      const statusVerify = rpcError.status as any;
      const status = isNaN(statusVerify) ? 500 : rpcError.status;
      response.status(status).json({
        status: status,
        message: message,
      });
      return;
    }
    console.log('rpcError', rpcError);
    response.status(400).json({
      status: 400,
      message: 'Bad Request',
    });
  }
}
