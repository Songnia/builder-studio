<?php

namespace App\Exceptions;

use RuntimeException;

class MaketouApiException extends RuntimeException
{
    public function __construct(
        public readonly ?string $apiCode,
        public readonly int $httpStatus,
        string $message,
    ) {
        parent::__construct($message);
    }
}
